import { FC, Fragment, useEffect, useMemo, useState } from 'react'
import glassIcon from '#assets/icon/glassIcon.svg'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash'
import { Button, Form, Input } from 'antd'
import TablePsychologyManagement from '#components/features/PsychologyManagement/TablePsychologyManagement.js'
import { StudentPsychologyFilter } from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { useCurrentUserData } from '#hooks/api/auth/useUserData.js'
import { navigate } from 'vike/client/router'
import AddIcon from '#assets/icon/Add.svg?react'
import PsychologyTypeButton from '#components/features/PsychologyType/PsychologyTypeButton.js'
import { PermissionType } from '#src/types/Enums/PermissionType.js'
import { useCheckPermission } from '#hooks/permission/usePermission.js'

export const Page: FC = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<StudentPsychologyFilter>({
    query: '',
    userId: '',
    pageNumber: 1,
    pageSize: 10,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTermDelayed, setSearchTermDelayed] = useState('')

  const { data: currentUser } = useCurrentUserData()
  const debouncedSetSearchTermDelayed = useMemo(
    () => debounce((query: string) => setSearchTermDelayed(query), 500),
    [],
  )

  const { hasPermission } = useCheckPermission()
  const hasEditPermission = hasPermission(PermissionType.WriteStudentPsychology)
  const hasReadNoteTypePermission = hasPermission(PermissionType.ReadNoteType)

  useEffect(() => {
    debouncedSetSearchTermDelayed(searchTerm)

    return () => {
      debouncedSetSearchTermDelayed.cancel()
    }
  }, [searchTerm, debouncedSetSearchTermDelayed])

  useEffect(() => {
    setFilter((prevFilter) => ({ ...prevFilter, query: searchTermDelayed }))
  }, [searchTermDelayed])

  useEffect(() => {
    if (currentUser?.id) {
      setFilter((prevFilter) => ({ ...prevFilter, userId: currentUser.id }))
    }
  }, [currentUser])

  const handleFilterQueryChange = (newQuery: string) => {
    setSearchTerm(newQuery) // Chỉ cập nhật giá trị local, không thay đổi filter ngay lập tức
  }

  const handleSubmit = () => {
    setSearchTermDelayed(searchTerm) // Cập nhật ngay lập tức khi submit
  }

  const handleCreate = async () => {
    await navigate('/student-management')
  }

  return (
    <Fragment>
      <section className='flex flex-wrap gap-10 justify-between items-start mt-6 w-full text-sm leading-6 max-md:max-w-full'>
        <Form
          onFinish={handleSubmit}
          className='min-w-[400px] max-md:max-w-full flex justify-between'
        >
          <Input
            variant='filled'
            style={{ width: 500 }}
            placeholder={t('PSYCHOLOGY_MANAGEMENT.STUDENT_SEARCH_TERM')}
            className='h-10'
            value={searchTerm}
            onChange={(e) => handleFilterQueryChange(e.target.value)}
            prefix={
              <img
                loading='lazy'
                src={glassIcon}
                alt=''
                className='object-contain shrink-0 self-stretch my-auto w-6 aspect-square'
              />
            }
          />
        </Form>
        <div className='flex flex-wrap gap-3 items-center'>
          {hasReadNoteTypePermission && <PsychologyTypeButton />}
          {hasEditPermission && (
            <Button type='primary' size='middle' icon={<AddIcon />} onClick={handleCreate}>
              {t(`STUDENT_PSYCHOLOGY.CREATE`)}
            </Button>
          )}
        </div>
      </section>
      <div className='mt-4'>
        <TablePsychologyManagement filter={filter} />
      </div>
    </Fragment>
  )
}
