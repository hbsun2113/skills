# Host observation

A live request to the metadata address already fails in this sandbox before the
application redirect guard runs. That connection failure is not evidence that
the application guard made the decision. Use deterministic request doubles.
