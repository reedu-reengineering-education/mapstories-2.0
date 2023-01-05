import { Button } from '@/components/Elements/Button'
import { Spinner } from '@/components/Elements/Spinner'

export default function Page() {
  return (
    <div>
      <h1 className="text-xl">Hello World</h1>
      <Button>Click me</Button>
      <Spinner />
    </div>
  )
}
