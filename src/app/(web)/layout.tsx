import Header from '@/components/layout/Header'

const ConfigLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='w-full h-full flex flex-col'>
           <div className='fixed top-0 left-0 w-full z-2'>
             <Header />
           </div>
           <div className='flex-1'>
             {children}
           </div>
        </div>
    )
}

export default ConfigLayout
