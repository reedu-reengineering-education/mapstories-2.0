interface EditorPageProps {
  params: { stepId: string }
}

export default function StepPage({ params: { stepId } }: EditorPageProps) {
  return <p>Hello {stepId}</p>
}
