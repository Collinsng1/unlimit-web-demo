import { useContext, useState } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StatusPage from './pages/StatusPage.tsx'
import { CheckoutDetailsProvider } from './context/CheckoutDetailsContext.tsx'
import TextField from './components/TextField.tsx'
import { ChakraProvider, Switch } from '@chakra-ui/react'
import { SettingsContext, SettingsProvider } from './context/SettingContext.tsx'
import Divider from './components/Divider.tsx'
import { CallbackPage } from './pages/CallbackPage.tsx'
import { PayloadProvider } from './context/PayloadContext.tsx'
import unlimitLogo from "./assets/Unlimit_Logo.svg"
import HomePage from './pages/HomePage.tsx'
import ThreeDSPage from './pages/ThreeDSPage.tsx'


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <ChakraProvider>
      <SettingsProvider>
        <CheckoutDetailsProvider>
          <PayloadProvider>
            <BrowserRouter>
              <NavBar />
              <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/status' element={<StatusPage />} />
                  <Route path='/callback' element={<CallbackPage />} />
                  <Route path='/3ds' element={<ThreeDSPage />} />
              </Routes>
            </BrowserRouter>
          </PayloadProvider>
        </CheckoutDetailsProvider>
      </SettingsProvider>
    </ChakraProvider>
  // </React.StrictMode>,
)


function NavBar() {

  const settings = useContext(SettingsContext)

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="h-[72px] border-b-[2px] px-[16px] lg-[0px]">
        <div className="container  h-full mx-auto flex flex-row items-center" >
          <img src={unlimitLogo} alt="unlimit-logo" className='h-[24px]' />
          <div className="flex-1" />
          <img className='aspect-square h-[24px]' src="https://img.icons8.com/small/96/settings--v1.png" alt="settings--v1" onClick={() => { setIsModalOpen(true) }} />
        </div>
      </div>
      {
        isModalOpen && (
          <div className='fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50' onClick={() => { setIsModalOpen(prev => !prev) }}>
            <div className='flex flex-col bg-white rounded-[16px] overflow-hidden' onClick={(e) => e.stopPropagation()}>
              <div className='p-[24px]'>
                <div className='font-bold text-[20px] mb-[12px]'>Setting</div>
                <div className='flex flex-row items-center h-[48px]'>
                  <div className='font-bold text-[16px]'>3DS Enabled</div>
                  <div className='flex-1' />
                  <Switch
                    size='lg'
                    isChecked={settings?.paymentData.three_ds_mode === "01"}
                    onChange={() => { settings?.updatePaymentData({ three_ds_mode: settings?.paymentData.three_ds_mode === "01" ? "03" : "01" }) }}
                  />
                </div>
                <div className='flex flex-row items-center h-[48px]'>
                  <div className='font-bold text-[16px]'>Pre Auth</div>
                  <div className='flex-1' />
                  <Switch
                    size='lg'
                    isChecked={settings?.paymentData.preauth}
                    onChange={() => { settings?.updatePaymentData({ preauth: !settings.paymentData.preauth }) }}
                  />
                </div>
                <Divider />
                <div className='font-bold text-[16px] mb-[12px]'>Items</div>
                <div className='grid grid-cols-2 gap-[8px]'>
                  <TextField
                    title={'Price'}
                    type="text"
                    value={settings?.paymentData.amount}
                    onChange={(e) => { settings?.updatePaymentData({ amount: Number(e.target.value) }) }}
                  />
                  <TextField
                    title={'Currency'}
                    type="text"
                    value={settings?.paymentData.currency}
                    onChange={(e) => { settings?.updatePaymentData({ currency: e.target.value }) }}
                  />
                </div>
              </div>
              <div className='h-[64px] w-full bg-yellow-400 flex flex-row items-center justify-center' onClick={() => { setIsModalOpen(false) }}>
                <div className='font-bold'>Done</div>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}