interface CategoryBadgeProps {
  category: string
  variant?: 'default' | 'card'
}

const CategoryBadge = ({ category, variant = 'default' }: CategoryBadgeProps) => {
  if (variant === 'card') {
    return (
      <span className="inline-block px-2.5 py-1 text-xs font-medium text-text-light-secondary dark:text-text-dark-secondary bg-surface-light dark:bg-surface-dark rounded-full">
        {category}
      </span>
    )
  }

  return (
    <span className="inline-block px-3 py-1 text-sm font-medium bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary rounded-lg border border-border-light dark:border-border-dark">
      {category}
    </span>
  )
}

export default CategoryBadge

