import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getStrictReadmeSummary } from "./chain";

type SummaryPayload = {
  githubUrl: string;
};

const logPrefix = "[get-summary]";

const logInfo = (message: string, data?: Record<string, unknown>) =>
  console.info(`${logPrefix} ${message}`, data ?? "");

const logError = (message: string, data?: Record<string, unknown>) =>
  console.error(`${logPrefix} ${message}`, data ?? "");

const isValidSummaryRequest = (payload: unknown): payload is SummaryPayload =>
  !!payload &&
  typeof payload === "object" &&
  typeof (payload as SummaryPayload).githubUrl === "string";

const fetchReadme = async (githubUrl: string): Promise<string | null> => {
  logInfo("Starting README fetch", { githubUrl });

  try {
    const match = githubUrl.match(
      /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)(?:\.git)?(?:\/)?/
    );
    if (!match) {
      logError("Unable to parse GitHub URL", { githubUrl });
      return null;
    }

    const [, owner, repo] = match;
    logInfo("Resolved owner and repo", { owner, repo });

    const branches = ["main", "master"];
    const headers = buildGitHubHeaders();
    for (const branch of branches) {
      const url = `https://api.github.com/repos/${owner}/${repo}/readme?ref=${branch}`;
      logInfo("Attempting fetch for branch README", { branch, url });

      const response = await fetch(url, { headers });

      logInfo("Fetched README response", {
        branch,
        status: response.status,
        ok: response.ok,
      });
      if (response.ok) {
        const readmePayload = (await response.json()) as {
          encoding?: string;
          content?: string;
        };
        if (readmePayload.encoding !== "base64" || !readmePayload.content) {
          logError("Unexpected README payload", {
            branch,
            encoding: readmePayload.encoding,
          });
          continue;
        }

        const readmeContent = Buffer.from(
          readmePayload.content,
          "base64"
        ).toString("utf-8");
        logInfo("README fetched successfully", {
          branch,
          size: readmeContent.length,
        });
        return readmeContent;
      }

      logInfo("README not found for branch", { branch, status: response.status });
    }

    logError("README not found on any branch", { owner, repo });
    return null;
  } catch (error) {
    logError("Error fetching README", { githubUrl, error });
    return null;
  }
};

const buildGitHubHeaders = (): Record<string, string> => {
  const githubToken = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }
  return headers;
};

const fetchRepoMetadata = async (githubUrl: string) => {
  const match = githubUrl.match(
    /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)(?:\.git)?(?:\/)?/
  );
  if (!match) return null;
  const [, owner, repo] = match;
  const headers = buildGitHubHeaders();

  const repoResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    { headers }
  );
  if (!repoResponse.ok) {
    logError("Unable to fetch repo metadata", {
      status: repoResponse.status,
      owner,
      repo,
    });
    return null;
  }
  const repoPayload = (await repoResponse.json()) as {
    html_url?: string;
    stargazers_count?: number;
    forks_count?: number;
    open_issues_count?: number;
    description?: string | null;
    default_branch?: string;
  };

  let latestVersion: string | null = null;
  const releaseResponse = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    { headers }
  );
  if (releaseResponse.ok) {
    const releasePayload = (await releaseResponse.json()) as {
      tag_name?: string;
    };
    latestVersion = releasePayload.tag_name ?? null;
  }

  return {
    url: repoPayload.html_url ?? githubUrl,
    description: repoPayload.description ?? null,
    stars: repoPayload.stargazers_count ?? 0,
    forks: repoPayload.forks_count ?? 0,
    openIssues: repoPayload.open_issues_count ?? 0,
    defaultBranch: repoPayload.default_branch ?? null,
    latestVersion,
  };
};

export async function POST(request: NextRequest) {
  logInfo("Received POST request", {
    headers: {
      "api-key": request.headers.get("api-key"),
      "x-demo": request.headers.get("x-demo"),
    },
  });

  const body = await request.json().catch((error) => {
    logError("Failed to parse request body", { error });
    return null;
  });

  if (!isValidSummaryRequest(body)) {
    logError("Invalid payload", { body });
    return NextResponse.json({ valid: false, message: "Missing repository URL" }, { status: 400 });
  }

  const key = request.headers.get("api-key")?.trim() ?? "";
  const isDemo = request.headers.get("x-demo") === "true";
  const hasSession = !!request.cookies.get("google_session");
  if (!key && !isDemo) {
    logError("Missing API key");
    return NextResponse.json({ valid: false, message: "Missing API key" }, { status: 400 });
  }
  if (isDemo && !hasSession) {
    logError("Demo request without session");
    return NextResponse.json({ valid: false, message: "Authentication required" }, { status: 401 });
  }

  const githubUrl = body.githubUrl.trim();
  if (!githubUrl) {
    logError("Empty repository URL");
    return NextResponse.json({ valid: false, message: "Missing repository URL" }, { status: 400 });
  }

  logInfo("Valid request payload", { githubUrl });

  const openAIApiKey = process.env.OPENAI_API_KEY;
  if (!openAIApiKey) {
    logError("Missing OpenAI API key");
    return NextResponse.json(
      { valid: false, message: "Server misconfiguration: missing OpenAI API key" },
      { status: 500 }
    );
  }

  try {
    if (!isDemo) {
      logInfo("Validating API key via Supabase", { key });
      const { data: keyRecord, error: supabaseError } = await supabaseAdmin
        .from("api_keys")
        .select("id, usage_count, usage_limit")
        .eq("key", key)
        .limit(1)
        .maybeSingle();

      if (supabaseError) {
        logError("Supabase error verifying API key", { supabaseError });
        return NextResponse.json(
          { valid: false, message: "Unable to verify API key" },
          { status: 500 }
        );
      }

      if (!keyRecord) {
        logError("API key not found in Supabase", { key });
        return NextResponse.json({ valid: false, message: "Key not found" }, { status: 401 });
      }

      const usageCount = Number(keyRecord.usage_count ?? 0);
      const usageLimit =
        keyRecord.usage_limit === null || keyRecord.usage_limit === undefined
          ? null
          : Number(keyRecord.usage_limit);

      if (usageLimit !== null && usageCount >= usageLimit) {
        logError("API key usage limit exceeded", { key, usageCount, usageLimit });
        return NextResponse.json(
          { valid: false, message: "Rate limit exceeded" },
          { status: 429 }
        );
      }

      const { error: usageError } = await supabaseAdmin
        .from("api_keys")
        .update({ usage_count: usageCount + 1 })
        .eq("id", keyRecord.id);

      if (usageError) {
        logError("Unable to increment API key usage", { usageError });
        return NextResponse.json(
          { valid: false, message: "Unable to update API key usage" },
          { status: 500 }
        );
      }

      logInfo("API key verified and usage incremented", {
        key,
        usageCount: usageCount + 1,
        usageLimit,
      });
    } else {
      logInfo("Skipping API key verification for demo request");
    }

    const [readme, repoInfo] = await Promise.all([
      fetchReadme(githubUrl),
      fetchRepoMetadata(githubUrl),
    ]);
    if (!readme) {
      logError("README fetch failed", { githubUrl });
      return NextResponse.json({ message: "README not found" }, { status: 404 });
    }

    const summaryResult = await getStrictReadmeSummary({
      readme,
      openAIApiKey,
    });

    logInfo("Returning summary payload", { githubUrl });
    return NextResponse.json({
      summary: summaryResult.summary,
      facts: summaryResult.facts,
      repo: repoInfo,
    });
  } catch (error) {
    logError("Unable to verify key or fetch README", { error });
    return NextResponse.json(
      {
        valid: false,
        message: "Unable to verify key or fetch README",
      },
      { status: 500 }
    );
  }
}
