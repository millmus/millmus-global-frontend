import { useEffect, useRef, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaCheck } from 'react-icons/fa';

interface PaymentTermsModalProps {
  isOpen: boolean;
  closeModal: () => void;
  proceedWithPayment: () => void;
  refund_policy?: any;
}

const PaymentTermsModal: React.FC<PaymentTermsModalProps> = ({
  isOpen,
  closeModal,
  proceedWithPayment,
  refund_policy,
}) => {

  if (refund_policy) {
    console.log('refund_policy:', refund_policy);
  }
  const [hasScrolled, setHasScrolled] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);

  // 환불규정 보기 여부 상태관리
  const [isTermsVisible, setIsTermsVisible] = useState(false);

  const [individualTerms, setIndividualTerms] = useState({
    terms1: false,
    terms2: false,
  });
  const [allTermsAccepted, setAllTermsAccepted] = useState(false);

  useEffect(() => {
    const allAccepted = Object.values(individualTerms).every(Boolean);
    console.log('allAccepted', allAccepted);
    setAllTermsAccepted(allAccepted);
  }, [individualTerms]);

  const handleIndividualChange = (term: keyof typeof individualTerms) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    const newTerms = { ...individualTerms, [term]: checked };
    setIndividualTerms(newTerms);
    const allAccepted = Object.values(newTerms).every(Boolean);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#282e38] text-neutral-600 p-6 rounded-lg max-w-md w-full h-[380px]">
        { isTermsVisible ? (
        <div>
          <div
            className='text-white font-[400]'
          >
            클래스 환불규정 확인 및 동의
          </div>
          <div>
            <div
              className='overflow-y-auto h-[202px] bg-[#373c46] text-[#cfcfcf] rounded p-2 flex-wrap text-sm mt-2 whitespace-pre-line'
            >
              {`${refund_policy.title}\r\n\r\n${refund_policy.text}`}
            </div>
            <div
              className='mt-3 text-[14px] text-[#00E7FF]'
            >
              [스크롤을 내려 환불규정을 끝까지 읽어주세요]
            </div>
            <div
              className='mt-3'
            >
              <button
                onClick={() => {
                  setIndividualTerms((prevTerms) => ({
                    ...prevTerms,
                    terms2: true, // terms2를 true로 설정
                  }));
                  setIsTermsVisible(false); // 모달을 닫음
                }}
                style={{ 
                  width: '100%', marginTop: '10px', padding: '12px',
                  backgroundColor: '#00E7FF',
                  color: '#14161a',
                  fontWeight: '400',
                  border: 'none', borderRadius: '5px' }}>
                동의하기
              </button>
            </div>
          </div>
        </div>
        ) : (
        <div>
          <div>
            <div
              className='flex flex-col gap-2'
            >
              <label className="flex items-center">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="opacity-0 absolute"
                    checked={individualTerms.terms1}
                    onChange={handleIndividualChange('terms1')}
                  />
                  <div
                    className={`h-6 w-6 border-[1px] border-[#00e7ff] rounded flex items-center justify-center`}
                  >
                    {individualTerms.terms1 && <FaCheck className="text-[#00e7ff] w-[12px] h-[12px]" />}
                  </div>
                </div>
                <span className="ml-2 text-white">프리미엄 클래스 이용 동의</span>
              </label>
              <div
                className='overflow-y-auto h-[170px] bg-[#373c46] text-[#cfcfcf] rounded p-2 flex-wrap text-sm whitespace-pre-line'
              >
                {`· 밀머스에서 제공하는 교육과정과 수강생 케어는 “수강생의 적극적인 참여”를 기반으로 합니다.
· 성인교육 특성상 수업에 참여하고, 별도로 시간을 할애해 과제를 수행하고, 막히는 부분에 대한 질문을 하는 것은 수강생 본인의 책임입니다.
· 수강생 케어는 수강생이 질문없이도 운영진이 미리 어려움을 예상해 일일이 가이드 해드리는 것을 의미하지 않으며 이는 밀머스 교육이 지향하는 바가 아님을 알려드립니다.
· 수업에서 멘토님이 가르쳐 드리는 방향대로 수업듣고, 과제하고, 적극 실행해야 성과를 창출할 수 있다는 점 이해하고 신청해주시기 바랍니다.
· 수강생 성과는 개인의 노력에 따라 기간과 성과 정도가 다를 수 있으며 밀머스는 어떤 교육과정에서도 ‘성과보장’, ‘수익보장’을 약속하지 않습니다.
· 수강과정에 따라 한글, 엑셀, 파워포인트, 이메일 활용 등 기초적인 컴퓨터 활용능력을 필요로 할 수 있습니다. 컴퓨터 활용법은 스스로 찾아서 익히셔야 하고 컴퓨터를 가르쳐 드리는 과정은 제공하지 않습니다.
· 수강생 다수가 참여하는 단톡방 입장시 반드시 ‘성함/핸드폰뒷4자리’로 입장해주시고 명단 미확인시 경고 후 퇴장조치될 수 있습니다.
· 단톡방에서는 멘토님과 운영진, 타 수강생에 대한 예의를 지켜 대화해주시고 질의응답 및 개인톡 운영규칙을 준수해주시기 바랍니다.
· 산업안전보건법에 따라 멘토와 운영진, 타 수강생에 대한 비매너 발언, 반말, 폭언, 성희롱, 불필요한 사적인 연락 등 발생시 수강진도와 무관하게 환불없이 즉각 퇴장조치하며 수강자격이 박탈됩니다.`}
              </div>
              <label className="flex items-center" onClick={() => {setIsTermsVisible(true)}}>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="opacity-0 absolute"
                    checked={individualTerms.terms2}
                    // onChange={handleIndividualChange('terms2')}
                    readOnly
                  />
                  <div
                    className={`h-6 w-6 border-[1px] border-[#00e7ff] rounded flex items-center justify-center`}
                  >
                    {individualTerms.terms2 && <FaCheck className="text-[#00e7ff] w-[12px] h-[12px]" />}
                  </div>
                </div>
                <span className="ml-2 text-white">클래스 환불규정 확인 및 동의</span>
              </label>
            </div>
          </div>
          <div
              className='mt-3 text-[14px] text-[#00E7FF]'
            >
              박스에 체크해주세요
            </div>
          <div
            className='mt-3'
          >
            <button
              onClick={proceedWithPayment}
              disabled={!allTermsAccepted} style={{
                width: '100%', marginTop: '10px', padding: '12px 10px',
                backgroundColor: allTermsAccepted ? '#00E7FF' : '#686e7a',
                color: allTermsAccepted ? '#14161a' : '#fff',
                fontWeight: '400',
                border: 'none', borderRadius: '5px'
              }}>
              모두 동의하기
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default PaymentTermsModal;
