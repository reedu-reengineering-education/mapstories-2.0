import { cx } from 'class-variance-authority'
import { Skeleton } from './Elements/Skeleton'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cx('overflow-hidden rounded-lg border', className)}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Header = function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cx('grid gap-1 p-6', className)} {...props} />
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Content = function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cx('px-6 pb-4', className)} {...props} />
}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

Card.Footer = function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      className={cx('border-t bg-slate-50 px-6 py-4', className)}
      {...props}
    />
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

Card.Title = function CardTitle({ className, ...props }: CardTitleProps) {
  return <h4 className={cx('text-lg font-medium', className)} {...props} />
}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

Card.Description = function CardDescription({
  className,
  ...props
}: CardDescriptionProps) {
  return <div className={cx('text-sm text-gray-600', className)} {...props} />
}

Card.Skeleton = function CardSeleton() {
  return (
    <Card>
      <Card.Header className="gap-2">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-4 w-4/5" />
      </Card.Header>
      <Card.Content className="h-10" />
      <Card.Footer>
        <Skeleton className="h-8 w-[120px] bg-slate-200" />
      </Card.Footer>
    </Card>
  )
}
