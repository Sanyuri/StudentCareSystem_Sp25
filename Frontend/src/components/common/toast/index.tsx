import { ToastModel } from '#src/types/Data/ToastModel.js'

const ToastContent = ({ notify, message }: ToastModel) => {
  return (
    <article className='flex flex-col flex-1 shrink justify-center basis-0 min-w-[240px]'>
      <h2 className='text-sm font-semibold leading-6 text-neutral-300'>{notify}</h2>
      <p className='mb-0 text-sm font-medium leading-loose text-neutral-400'>{message}</p>
    </article>
  )
}

export default ToastContent
