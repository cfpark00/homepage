# TODO

## UI/UX Improvements

### Review for Flash/Loading Issues
- [ ] **Audit all client components for authentication flash issues**
  - Similar to the password input flash we fixed in thoughts-client.tsx
  - Check any component that reads from localStorage/cookies in useEffect
  - Pattern to look for: Initial render with wrong state → useEffect updates → re-render
  - Solution: Add isLoading state and return null during initial auth checks

- [ ] **Review all conditional UI rendering**
  - Components that show/hide based on client-side state
  - Ensure proper loading states to prevent content flash
  - Consider using suspense boundaries where appropriate

- [ ] **Check for layout shift issues**
  - Elements that appear/disappear after mount
  - Dynamic content that changes height after loading
  - Missing skeleton loaders or placeholders

### Specific Areas to Review
- [ ] Navigation components (mobile menu states)
- [ ] Protected routes/pages
- [ ] Theme switching (dark/light mode flash)
- [ ] Dynamic content areas (collapsibles, accordions)
- [ ] Form validation states
- [ ] Toast/notification appearances

### Best Practices to Implement
- [ ] Create a standard `useAuth` hook for consistent auth checking
- [ ] Establish loading state patterns for all async operations
- [ ] Document the "return null while loading" pattern for team reference