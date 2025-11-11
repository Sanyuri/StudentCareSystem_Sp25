import { FC, ReactNode, useEffect, useState } from 'react'
import FPTLogo from '#assets/img/FPT_University.jpeg'
import image from '#utils/constants/image.js'
import _ from 'lodash'
import { useAppSettingData } from '#hooks/api/appSetting/useAppSettingData.js'

const Page: FC = (): ReactNode => {
  const [imageHeaderUrl, setImageHeaderUrl] = useState<string | undefined>(undefined)
  const { data: settingData } = useAppSettingData()
  useEffect(() => {
    const headerImage: string | undefined = _.find(settingData, { key: 'BODY_BACKGROUND' })?.value
    if (headerImage) {
      setImageHeaderUrl(headerImage)
    }
  }, [settingData])

  return (
    <main className='flex flex-col md:flex-row h-screen'>
      <div className='relative w-full md:w-1/3 flex-shrink-0 overflow-hidden'>
        <img
          loading='lazy'
          src={imageHeaderUrl ?? FPTLogo}
          alt='FPT Logo'
          className='w-full h-full object-cover opacity-95 shadow-amber-50'
        />
        <div className='absolute top-4 left-4 w-25 h-10 flex ml-2'>
          <img src={image.logoNoLetter} alt='FPT Logo' className={'w-25 h-10'} />
          <span className='my-auto ml-3 text-xl font-bold text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]'>
            Student Care System FPT
          </span>
        </div>
      </div>
      <div className='flex flex-col px-4 md:px-8 md:w-2/3 flex-grow overflow-auto py-6'>
        <div className='w-full max-w-4xl mx-auto'>
          <h1 className='text-3xl font-bold mb-6 text-orange-600'>Student Care System</h1>

          {/* Badges */}
          <div className='flex flex-wrap gap-2 mb-6'>
            <a
              href='https://dotnet.microsoft.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
            >
              <img src='https://img.shields.io/badge/.NET-9.0-512BD4?logo=dotnet' alt='.NET' />
            </a>
            <a
              href='https://reactjs.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
            >
              <img src='https://img.shields.io/badge/React-18-61DAFB?logo=react' alt='React' />
            </a>
            <a
              href='https://vike.dev/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
            >
              <img src='https://img.shields.io/badge/Vike-SSR-4e56a6' alt='Vike' />
            </a>
            <a
              href='https://www.python.org/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
            >
              <img src='https://img.shields.io/badge/Python-3.11-3776AB?logo=python' alt='Python' />
            </a>
            <a
              href='https://www.docker.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
            >
              <img
                src='https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker'
                alt='Docker'
              />
            </a>
            <a
              href='https://www.elastic.co/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-block'
            >
              <img
                src='https://img.shields.io/badge/ELK-8.15.3-005571?logo=elastic'
                alt='ELK Stack'
              />
            </a>
          </div>

          {/* Overview Section */}
          <h2 className='text-2xl font-semibold mt-8 mb-4 text-orange-500'>📚 Overview</h2>
          <div className='space-y-4'>
            <p className='text-gray-700'>
              StudentCareSystem is an enterprise-grade application designed specifically for FPT
              University to support their mission of monitoring and managing the welfare of their
              students. The system helps identify students who may need additional care or
              assistance based on various factors such as attendance, academic performance, and
              behavioral patterns.
            </p>

            <p className='text-gray-700'>
              Developed as a capstone project for FPT University, this application aims to address
              the unique challenges faced by the university in providing timely and effective care
              for students throughout their academic journey. It streamlines the process of
              identifying at-risk students, coordinating interventions, and tracking outcomes.
            </p>

            <p className='text-gray-700'>
              The application employs AI-powered analytics to predict student risks and facilitate
              early intervention, helping educational staff provide timely and appropriate support
              to students in need.
            </p>
          </div>

          {/* System Architecture Section */}
          <h2 className='text-2xl font-semibold mt-8 mb-4 text-orange-500'>
            🏗️ System Architecture
          </h2>
          <p className='text-gray-700 mb-4'>
            StudentCareSystem follows a microservices architecture consisting of three primary
            components:
          </p>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>1. Backend (.NET 9.0)</h3>
          <p className='text-gray-700 mb-3'>
            The backend implements <strong>Clean Architecture</strong> with domain-driven design:
          </p>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>
              <strong>Domain Layer</strong>: Core business entities and business rules
            </li>
            <li>
              <strong>Application Layer</strong>: Application-specific business rules and use cases
            </li>
            <li>
              <strong>Infrastructure Layer</strong>: Data persistence, external services integration
            </li>
            <li>
              <strong>API Layer</strong>: RESTful endpoints exposing system functionality
            </li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>
            2. Frontend (React 18 with Vike SSR)
          </h3>
          <p className='text-gray-700 mb-3'>
            The frontend implements a <strong>Component-Based Architecture</strong>:
          </p>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>
              <strong>Presentation Layer</strong>: UI components with Ant Design
            </li>
            <li>
              <strong>State Management</strong>: Zustand and TanStack Query
            </li>
            <li>
              <strong>Service Layer</strong>: API integration with Axios
            </li>
            <li>
              <strong>Server Layer</strong>: Express server with Vike for SSR
            </li>
            <li>
              <strong>Security Layer</strong>: Code obfuscation, CSP, encrypted storage
            </li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>
            3. AI Service (Python FastAPI)
          </h3>
          <p className='text-gray-700 mb-3'>AI-powered service for:</p>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Student risk analysis and prediction</li>
            <li>Attendance pattern recognition</li>
            <li>Academic performance trend analysis</li>
            <li>Recommendation generation for intervention</li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>
            4. Supporting Services
          </h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>
              <strong>SQL Server</strong>: Primary database
            </li>
            <li>
              <strong>Redis</strong>: Caching layer
            </li>
            <li>
              <strong>Elasticsearch, Kibana, Filebeat</strong>: Logging and monitoring
            </li>
          </ul>

          {/* Key Features Section */}
          <h2 className='text-2xl font-semibold mt-8 mb-4 text-orange-500'>🔑 Key Features</h2>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>Multi-Tenant System</h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Support for multiple campuses within FPT University with data isolation</li>
            <li>Customizable workflows per department and campus</li>
            <li>
              Role-based access control with fine-grained permissions for different staff roles
              (advisors, lecturers, managers)
            </li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>
            Student Care Management
          </h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Comprehensive student profiles</li>
            <li>Need assessment and care assignment</li>
            <li>Progress tracking against defined criteria</li>
            <li>Note-taking and documentation</li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>Attendance Monitoring</h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Real-time attendance tracking</li>
            <li>Pattern recognition for concerning attendance</li>
            <li>Automated notifications for absence thresholds</li>
            <li>Visualization of attendance trends</li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>Academic Performance</h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Integration with academic systems</li>
            <li>Performance tracking across semesters</li>
            <li>Early warning indicators for declining performance</li>
            <li>Intervention recommendations</li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>
            AI-Powered Risk Analysis
          </h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Predictive analytics for student risk factors</li>
            <li>Multi-dimensional risk assessment</li>
            <li>Automated priority scoring</li>
            <li>Recommendation engine for interventions</li>
          </ul>

          <h3 className='text-xl font-semibold mt-6 mb-3 text-orange-400'>Communication</h3>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Email notification system</li>
            <li>Communication templates</li>
            <li>Follow-up scheduling</li>
            <li>Communication logs</li>
          </ul>

          {/* Team Section */}
          <h2 className='text-2xl font-semibold mt-8 mb-4 text-orange-500'>👥 Team</h2>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-4'>
            <li>Bùi Tuấn Sơn - Backend Lead</li>
            <li>Nguyễn Vinh Quang - Frontend Lead</li>
            <li>Bùi Việt Hồng - AI/ML Specialist</li>
            <li>Vương Công Minh - DevOps Engineer</li>
            <li>Nguyễn Thanh Tùng - UX/UI Designer</li>
          </ul>

          {/* Acknowledgments Section */}
          <h2 className='text-2xl font-semibold mt-8 mb-4 text-orange-500'>🙏 Acknowledgments</h2>
          <ul className='list-disc pl-5 space-y-1 text-gray-700 mb-6'>
            <li>Special thanks to FPT University for supporting this capstone project</li>
            <li>Faculty mentors and advisors from the FPT University academic staff</li>
            <li>Student care department for providing domain expertise and requirements</li>
            <li>Open source technologies that made this project possible</li>
          </ul>
        </div>
      </div>
    </main>
  )
}

export default Page
