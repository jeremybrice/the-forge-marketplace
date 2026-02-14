# Performance Analysis Template

This template defines the structure for performance-analysis report type. Synthesizer should follow this section organization when assembling the final report.

## Target Audience
Engineers, SREs, technical leads

## Tone
Data-driven, metrics-focused, quantitative. Focus on measurements and optimization.

## Length
3-6 pages

## Required Sections

### Performance Metrics
**Purpose**: Establish baseline measurements
**Content**: Current performance characteristics, metrics collected, measurement methodology
**Format**: Prose with metrics highlighted (can use bullet lists for lists of metrics)
**Guidance**: Lead with data. What was measured, how it was measured, what the results are. Reference Investigator's metric collection. Include units, timeframes, and sample sizes.

**Suggested metrics** (adapt based on what's available):
- Response times (p50, p95, p99 latencies)
- Throughput (requests per second, messages per second)
- Resource usage (CPU, memory, disk, network)
- Error rates (failure percentage, timeout percentage)
- Concurrency levels (active connections, thread pool sizes)

### Bottlenecks
**Purpose**: Identify performance issues
**Content**: Specific areas where performance is limited, constrained, or degraded
**Format**: Prose paragraphs organized by bottleneck type
**Guidance**: Use Analyst's pattern identification to spot bottlenecks. Be specific about what's slow and under what conditions. Quantify the impact where possible.

**Suggested categories**:
- I/O bottlenecks (database queries, API calls, file system)
- CPU bottlenecks (compute-heavy operations, inefficient algorithms)
- Memory bottlenecks (memory leaks, excessive allocation, cache misses)
- Network bottlenecks (bandwidth limits, high latency calls)
- Concurrency bottlenecks (locks, serialization points, thread starvation)

### Root Causes
**Purpose**: Explain why bottlenecks exist
**Content**: Underlying reasons for performance issues (inefficient algorithms, missing indices, N+1 queries, etc.)
**Format**: Prose paragraphs linking each bottleneck to its root cause
**Guidance**: Use Analyst's interpretation to connect observed symptoms (slow response time) to underlying causes (N+1 query pattern). Explain the mechanism by which the root cause creates the bottleneck.

### Optimization Opportunities
**Purpose**: Identify potential improvements
**Content**: Specific optimizations that could improve performance, with expected impact
**Format**: Numbered or bulleted list with substantive descriptions
**Guidance**: Draw from Analyst's opportunities section. Each opportunity should describe: what to optimize, how to optimize it, expected performance gain.

**Categories of optimization**:
- Caching (add caching, improve cache hit rates)
- Query optimization (add indices, rewrite queries, reduce query count)
- Algorithm improvement (replace O(n²) with O(n log n))
- Resource pooling (connection pools, thread pools)
- Asynchronous processing (background jobs, message queues)
- Load distribution (sharding, horizontal scaling, load balancing)

### Implementation Plan
**Purpose**: Describe how to execute optimizations
**Content**: Sequenced steps for implementing optimizations, prioritized by impact vs. effort
**Format**: Numbered phases or matrix of optimizations
**Guidance**: Not all optimizations are equal. Prioritize high-impact, low-effort wins first. Sequence optimizations so foundational changes come before dependent changes.

**Suggested format**:
1. Quick wins (high impact, low effort - implement first)
2. Strategic improvements (high impact, higher effort - plan carefully)
3. Nice-to-haves (lower impact - implement if resources available)

Or use a prose approach describing optimization sequence and rationale.

## Optional Sections

### Measurement Methodology (if methodology is non-obvious)
**Purpose**: Explain how performance was measured
**Format**: Prose
**When to include**: If measurement approach is complex or needs explanation for reproducibility

### Performance Budget (if applicable)
**Purpose**: Define acceptable performance targets
**Format**: Table or list of targets
**When to include**: If specific SLAs or targets exist or should be established

### Scalability Assessment (if relevant)
**Purpose**: Evaluate how performance changes with load
**Format**: Prose with projections
**When to include**: If scalability is a concern or investigation covered load testing

### Monitoring Recommendations (if gaps exist)
**Purpose**: Suggest performance monitoring improvements
**Format**: Bullet list
**When to include**: If Investigator identified monitoring gaps

## Formatting Rules
- Use `##` for major sections
- Use `###` for subsections
- Blank lines between major sections
- Substantive bullets (1-2 sentences minimum)
- No tables (use prose descriptions or bulleted lists with metrics)
- No dashes as thought separators
- Include units with all metrics (ms, MB, req/s, etc.)
- Quantify impact where possible (percentage improvement, absolute improvement)

## Example Structure

```markdown
## Performance Metrics

[Introductory paragraph describing what was measured and methodology]

### Response Time Metrics

[Prose describing latency measurements]
- p50: 45ms
- p95: 120ms
- p99: 350ms
[Context about what these numbers mean and whether they're acceptable]

### Throughput Metrics

[Prose describing throughput measurements]
- Peak: 450 req/s
- Average: 280 req/s
[Context]

### Resource Utilization

[Prose describing CPU, memory, network usage during testing/observation period]

## Bottlenecks

### Database Query Performance

[Prose describing slow queries identified by Investigator. Cite specific query patterns or file references. Quantify the impact (e.g., "accounts for 60% of total response time")]

### API Call Latency

[Prose describing slow external API calls. Quantify impact.]

### In-Memory Processing

[Prose describing CPU-bound operations that limit throughput]

## Root Causes

### N+1 Query Pattern in Notification Lookup

[Prose explaining how the N+1 pattern creates the database bottleneck. Reference specific files/functions from Investigator. Explain the mechanism: "For each notification sent, the system makes a separate database query to fetch the template, resulting in 100 queries for 100 notifications instead of 1."]

### Lack of Caching for Templates

[Prose explaining how missing cache causes repeated work]

### Synchronous External API Calls

[Prose explaining how blocking calls limit concurrency]

## Optimization Opportunities

1. **Implement Template Caching**
   [Prose: cache notification templates in-memory with TTL of 5 minutes, reducing database load by estimated 80% for template lookups. Expected improvement: ~25ms reduction in p95 latency.]

2. **Batch Database Queries**
   [Prose: replace N+1 pattern with batched queries using WHERE IN clause. Expected improvement: ~40ms reduction in p95 latency, 3x reduction in database query count.]

3. **Async Processing for Non-Critical Notifications**
   [Prose: move marketing emails to background queue, freeing request threads. Expected improvement: 2x throughput increase for user-triggered notifications.]

## Implementation Plan

### Phase 1: Quick Wins (Week 1-2)

1. **Template Caching** — Highest impact, lowest risk. Implement in-memory cache with 5-minute TTL.
2. **Query Batching** — High impact, moderate effort. Refactor notification lookup to batch queries.

Expected combined improvement: ~50% reduction in p95 latency, 5x reduction in database load.

### Phase 2: Strategic Improvements (Week 3-6)

3. **Async Queue for Marketing Emails** — Requires queue infrastructure setup, but unlocks significant throughput gains.
4. **Connection Pooling** — Implement database connection pool with configurable size (currently using single connection per request).

Expected combined improvement: 2-3x throughput increase, improved resilience during traffic spikes.

### Phase 3: Monitoring and Refinement (Ongoing)

5. **Performance Instrumentation** — Add detailed performance logging for each stage (template lookup, notification send, etc.) to enable ongoing optimization.
6. **Load Testing** — Establish regular load testing to catch regressions.

### Prioritization Rationale

Quick wins deliver immediate impact with minimal risk. Strategic improvements require more effort but unlock scalability. Monitoring ensures sustained performance and early detection of regressions.
```

## Synthesizer Guidance

When using this template:

1. **Lead with data** — Performance analysis is about measurements. Start with metrics.
2. **Quantify everything** — Not "slow queries" but "queries averaging 180ms, accounting for 60% of total response time."
3. **Connect symptoms to causes** — Bottlenecks are symptoms; root causes explain why they exist.
4. **Estimate impact** — For each optimization opportunity, estimate the expected performance improvement (even if rough).
5. **Prioritize pragmatically** — Recommend high-impact, low-effort wins first. Defer complex refactors unless impact justifies effort.
6. **Be realistic about measurement** — If Investigator found no performance logs, acknowledge this limitation and frame recommendations as hypotheses to be validated after instrumentation.
7. **Include units** — Always specify units (ms, MB, req/s, %) for metrics and improvements.
8. **Show trade-offs** — Some optimizations add complexity (caching adds invalidation complexity). Acknowledge this.
