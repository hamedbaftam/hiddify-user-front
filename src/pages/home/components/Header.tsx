import { Text } from "../../../designSystem/Text"
import ShareIcon from '@mui/icons-material/Share';
import MenuDropdown from "./MenuDropdown";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, CardMedia, Tooltip } from "@mui/material";
import HLogo from '@assets/images/apple-touch-icon.png'
import { Modal } from "../../../designSystem/Modal";
import ShareLinks from "./ShareLinks";
import DohContent from "./DohContent";
import { useTranslation } from "react-i18next";
import TranslateIcon from '@mui/icons-material/Translate';
import ChangeLangModal from "./ChangeLangModal";
import { getCurrentUrl } from "../../../utils/getCurrentUrl";
import useAPI from "../../../hooks/useAPI";
import { useSearchParams } from "react-router-dom"

type propsTypes = {
  setShowAllConfigs:  Dispatch<SetStateAction<boolean>>;
  setShowTeleProxy:  Dispatch<SetStateAction<boolean>>;
  setShowMainBody:  Dispatch<SetStateAction<boolean>>;
  showAllConfigs: boolean;
  showTeleProxy: boolean;
  showMainBody: boolean;
  info: any;
}

const Header: FC<propsTypes> = (props) => {
  const { 
    setShowAllConfigs, 
    setShowTeleProxy, 
    setShowMainBody, 
    showAllConfigs, 
    showTeleProxy, 
    showMainBody,
    info,
  } = props;

  const [shareModal, setShareModal ] = useState(false)
  const [dohModal, setDohModal ] = useState(false)
  const [changeLangModal, setChangeLangModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const username = searchParams.get("username")
  const password = searchParams.get("password")

  const { t } = useTranslation();

  const showMainBodyFun = () => {
    setShowAllConfigs(false)
    setShowTeleProxy(false)
    setShowMainBody(true)
  }

  const showAllConfigsFun = () => {
    setShowAllConfigs(true)
    setShowTeleProxy(false)
    setShowMainBody(false)
  }

  const showTeleProxyFun = () => {
    setShowAllConfigs(false)
    setShowTeleProxy(true)
    setShowMainBody(false)
  }

  const getInfo = useAPI(
    'https://tunnelino.com/api/v1/me',
    'get',
    {
      query: { username, password },
      reactQueryOptions: { enabled: true },
      // Pass the extracted query params to the API
    }
  );

  const handleGoToSpeedTest = () => {

    const currentUrl = getCurrentUrl(false)
    // Navigate to the new URL
    window.open(currentUrl + '/speedtest/', '_blank');
  };

  return (
    <>
      <div className={`md:hidden ${showMainBody && 'bg-[#E0E4F5] bg-opacity-50'} w-full h-[10%] flex items-center justify-between px-5 py-3`}>
        <MenuDropdown 
          dohModal={setDohModal} 
          setChangeLangModal={setChangeLangModal}
          showAllConfigs={showAllConfigsFun}
          showTeleProxy={showTeleProxyFun}
          handleGoToSpeedTest={handleGoToSpeedTest}
          showMainBodyFun={showMainBodyFun}
        />
        <div onClick={showMainBodyFun} className="flex items-center gap-3 cursor-pointer">
          <CardMedia
              sx={{ height: 24, width: 24, marginBottom: 1 }}
              image={info?.brand_icon_url ? info?.brand_icon_url : HLogo}
              title="Logo"
          />
          <Text 
            fontWeight="medium" 
            fontSize="xl" 
            className="text-[#118ae9]" 
          >
            {info?.brand_title ? info?.brand_title : t('Tunnelino')}
          </Text>
        </div>
        <Button onClick={() => setShareModal(true)} className='bg-transparent [&.css-1e6y48t-MuiButtonBase-root-MuiButton-root]:min-w-[unset]'>
          <ShareIcon sx={{ color: '#292D32'}} />
        </Button>
      </div>
      <div className="hidden w-full md:w-7/12 md:min-w-[650px] max-w-[1000px] h-[10%] bg-transparent md:flex items-center justify-between py-3">
        <div className="w-fit flex items-center lg:gap-8 xl:gap-11 md:gap-5">
          <div onClick={showMainBodyFun} className="flex items-center gap-3 cursor-pointer">
            <CardMedia
                sx={{ height: 24, width: 24, marginBottom: 1 }}
                image={info?.brand_icon_url ? info?.brand_icon_url : HLogo}
                title="Logo"
            />
            <Text fontWeight="semibold" fontSize="lg" className="hidden lg:block text-[#118ae9]" >{info?.brand_title ? info?.brand_title : t('Tunnelino')}</Text>
          </div>
          {getInfo.data && getInfo.data?.telegram_proxy_enable ? 
            <Text 
              onClick={showTeleProxyFun} 
              fontWeight="semibold" 
              fontSize="lg" 
              className={`text-[#495057] cursor-pointer ${showTeleProxy && 'underline decoration-[#118ae9] decoration-solid decoration-[2px] underline-offset-8'}`}
            >
              {t('Telegram proxy')}
            </Text>
          : null}
          {getInfo.data && getInfo.data?.speedtest_enable ? 
            <Text 
              fontWeight="semibold" 
              fontSize="lg" 
              className={`text-[#495057] cursor-pointer`}
              onClick={handleGoToSpeedTest}
            >
              {t('Speed test')}
            </Text>
          : null}
        </div>
        <Button
          size='small'
          className='bg-transparent [&.css-bb99s9-MuiButtonBase-root-MuiButton-root]:min-w-[unset]'
          onClick={() => setChangeLangModal(true)}
        >
          <Tooltip title="Change language" >
            <TranslateIcon sx={{ color: '#495057'}} />
          </Tooltip>
        </Button>
      </div>


      <Modal title={t("DNS over HTTPS (DoH)")} isModalOpen={dohModal} closeModal={() => setDohModal(false)}>
        <DohContent />
      </Modal>

      <Modal title={t("Change language")} isModalOpen={changeLangModal} closeModal={() => setChangeLangModal(false)}>
        <ChangeLangModal setChangeLangModal={setChangeLangModal} />
      </Modal>
    </>
  )
}

export default Header