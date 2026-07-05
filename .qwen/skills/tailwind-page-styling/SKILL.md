---
name: tailwind-page-styling
description: Apply Tailwind CSS styling to content pages with proper typography hierarchy and spacing
source: auto-skill
extracted_at: '2026-06-09T02:19:18.656Z'
---

# Tailwind Page Styling for Content Pages

## Overview
This skill provides a systematic approach to applying Tailwind CSS styling to content pages, ensuring consistent typography hierarchy, proper spacing, and visual alignment with the site design system.

## Approach

### 1. Container Setup
- Use the `Container` component with appropriate spacing: `py-8 max-w-4xl`
- The `py-8` provides vertical padding for breathing room
- The `max-w-4xl` constrains content width for better readability

### 2. Header Section
Create a centered header section with visual separation:
```jsx
<div className="text-center py-8 border-b border-slate-200">
  <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Title</h1>
  <p className="text-sm text-slate-600">Last updated: [date]</p>
</div>
```

### 3. Content Organization
Structure content into semantic sections with consistent spacing:
```jsx
<div className="space-y-8">
  <section className="space-y-6">
    <h2 className="text-2xl font-semibold text-slate-900">Section Title</h2>
    <div className="space-y-4 text-slate-700 leading-relaxed">
      <p>Content here...</p>
    </div>
  </section>
</div>
```

### 4. Typography Hierarchy
Use consistent heading sizes and weights:
- Main title: `text-3xl font-bold text-slate-900`
- Section titles: `text-2xl font-semibold text-slate-900`
- Subsection titles: `text-xl font-medium text-slate-800`
- Body text: `text-slate-700`

### 5. Lists and Links
- Lists: Use `space-y-3` or `space-y-4` for consistent spacing
- Links: Style with `text-blue-600 hover:text-blue-700 transition-colors`
- Strong/bold text: Use `text-slate-900` for better contrast

### 6. Paragraph Spacing
Use `leading-relaxed` for better readability and `space-y-4` between paragraphs.

## Implementation Steps

1. **Replace basic Container usage** with enhanced styling
2. **Add header section** with title and metadata
3. **Organize content into sections** using semantic HTML
4. **Apply typography hierarchy** consistently
5. **Style links and lists** with Tailwind utilities
6. **Ensure proper spacing** between elements

## Common Patterns

### For Disclaimers and Legal Pages
```jsx
<Container className="py-8 max-w-4xl">
  <div className="space-y-8">
    <div className="text-center py-8 border-b border-slate-200">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Page Title</h1>
      <p className="text-sm text-slate-600">Last updated: [date]</p>
    </div>
    
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-slate-900">Section Title</h2>
      <div className="space-y-4 text-slate-700 leading-relaxed">
        <p>Content paragraphs...</p>
      </div>
    </section>
  </div>
</Container>
```

### Lists with Definitions
```jsx
<ul className="space-y-4 text-slate-700">
  <li>
    <strong className="text-slate-900">Term:</strong> Definition text...
  </li>
</ul>
```

## Best Practices

1. **Maintain consistency** across all content pages
2. **Use semantic HTML elements** for better accessibility
3. **Ensure proper contrast** with text colors
4. **Test responsive behavior** on different screen sizes
5. **Keep paragraphs concise** with proper line spacing
6. **Use consistent spacing patterns** throughout the page

## Troubleshooting

- If text appears too cramped, increase spacing with `space-y-*` utilities
- If headings are too bold, reduce font-weight (e.g., `font-semibold` instead of `font-bold`)
- If links don't stand out, ensure they have proper hover effects
- If content overflows, adjust container width or break into smaller sections