import MainBody from "./components/MainBody"
import BrandAndLogo from "./components/BrandAndLogo"
import FooterSocialIcons from "./components/FooterSocialIcons"
import Header from "./components/Header"
import { AllConfigs } from "./allConfigs"
import { useEffect, useState } from "react"
import { TeleProxy } from "./teleProxy"
import useAPI from "../../hooks/useAPI"
import PreLoading from "./components/PreLoading"
import { useTranslation } from "react-i18next"
import useMediaQuery from "../../hooks/useMediaQuery"


const Home = () => {
  const [showAllConfigs, setShowAllConfigs] = useState(false)
  const [showTeleProxy, setShowTeleProxy] = useState(false)
  const [showMainBody, setShowMainBody] = useState(true)

  const getInfo = useAPI(
    'me/',
    'GET',
    { reactQueryOptions: { enabled: true } }
  );

  const getApps = useAPI(
    'apps/',
    'GET',
    { reactQueryOptions: { enabled: true } }
  );

  const { i18n: {changeLanguage, language} } = useTranslation();

  useEffect(() => {
    if (language === 'fa') {
      document.body.classList.add('rtl');
      document.body.classList.add('fa-font');
    } else {
      document.body.classList.remove('rtl');
      document.body.classList.remove('fa-font');
    }
  }, [language])

  useEffect(() => {
      if(getInfo.data && getInfo.data.lang && language !== getInfo.data.lang){
        changeLanguage(getInfo.data.lang);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInfo.data])

  const isMobile = useMediaQuery('(max-width: 767px)');

  useEffect(() => {
    if (isMobile){
      const documentHeight = () => {
        const doc = document.documentElement
        doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
        }
      window.addEventListener('resize', documentHeight)
      documentHeight()
    }
  }, [isMobile])


  return getInfo.isLoading ? (<PreLoading />) : (
    <div id="page" className={`bg-[#F4F4F9] w-full md:h-screen h-[var(--doc-height)] overflow-hidden md:overflow-hidden m-0 p-0 md:flex flex-col md:justify-center md:items-center`}>
      <Header 
        setShowAllConfigs={setShowAllConfigs}
        setShowTeleProxy={setShowTeleProxy}
        setShowMainBody={setShowMainBody}
        showAllConfigs={showAllConfigs}
        showTeleProxy={showTeleProxy}
        showMainBody={showMainBody}
      />
      <div className="w-full md:w-8/12 md:min-w-[650px] h-[80vh]">
        {showAllConfigs && <AllConfigs />}
        {showMainBody && <MainBody />}
        {showTeleProxy && <TeleProxy />}
      </div>
      <div dir="ltr" className={`${showMainBody && 'bg-[#E0E4F5] md:bg-transparent bg-opacity-50 md:bg-opacity-[unset]'} md:w-8/12 md:min-w-[650px] h-[10vh] w-full flex justify-between items-center px-5 md:px-0 py-5`}>
          <FooterSocialIcons />
          <BrandAndLogo />
      </div>
    </div>
  )
}

export default Home