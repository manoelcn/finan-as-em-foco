name: code-reviewer
description: Review code for security vulnerabilities, performance issues,
  and best practice violations. Use when examining code changes, reviewing
  PRs, analyzing code quality, or when asked to review, audit, or check code.
allowed-tools: Read, Grep, Glob
---

# Code Review Expertise

## Security Checks
When reviewing code, verify:

### Input Validation
- All user input sanitized before database operations
- Parameterized queries (no string interpolation in SQL)
- Output encoding for rendered HTML content

### Authentication
- Session tokens validated on every protected endpoint
- Permission checks before data mutations
- No hardcoded credentials or API keys in source

### Data Exposure
- PII masked in log output and error messages
- API responses don't leak internal IDs or stack traces
- Sensitive fields excluded from serialization defaults