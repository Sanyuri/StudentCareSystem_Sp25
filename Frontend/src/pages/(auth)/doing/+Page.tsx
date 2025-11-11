import { TestService } from '#src/services/TestService.js'
export { Page }

function Page() {
  const handleTest = async () => {
    await TestService.test({ to: 'st' })
  }
  return (
    <>
      <h1>Hello</h1>
      <p>This screen will be completed in the future</p>
      <div onClick={handleTest}>Click test send email</div>
    </>
  )
}
