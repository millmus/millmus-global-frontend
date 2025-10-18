import Layout from '@layouts/sectionLayout';

interface IProps {
  data: any[];
}

export default function Customized({ data }: IProps) {
  const rows = [
    [
      {text: "😊무료특강", href: "/lecture/coin/1"},
      {text: "🏅마스터시리즈", href: "/lecture/master/1"},
      {text: "🏠부동산투자", href: "/lecture/real-estate/1"},
      {text: "📈미국주식", href: "/lecture/stock/1"},
      {text: "👨🏻‍💻온라인창업", href: "/lecture/online-business/1"},
      {text: "💸월1억퀀텀점프", href: "/lecture/detail/33"},
      {text: "📱SNS 수익화", href: "/lecture/online-business/1"},
      {text: "🙌오프특강", href: "/offline"},
    ],
    [
      {text: "#현금흐름", href: "/lecture/detail/1"},
      {text: "#경매", href: "/lecture/detail/52"},
      {text: "#에어비앤비", href: "/lecture/detail/75"},
      {text: "#스마트스토어", href: "/lecture/detail/25"},
      {text: "#커뮤니티사업", href: "/lecture/detail/37"},
      {text: "#인스타그램", href: "/lecture/detail/16"},
      {text: "#유튜브", href: "/lecture/detail/45"},
      {text: "#블로그", href: "/lecture/detail/9"},
      {text: "#구글애드센스", href: "/lecture/detail/47"},
    ],
    [
      {text: "#강용수", href: "/lecture/detail/1"},
      {text: "#옌마드", href: "/lecture/detail/25"},
      {text: "#유근용", href: "/lecture/detail/52"},
      {text: "#송희구", href: "/lecture/detail/6"},
      {text: "#희스토리", href: "/lecture/detail/37"},
      {text: "#포리얼", href: "/lecture/detail/33"},
      {text: "#아로스", href: "/lecture/detail/47"},
      {text: "#페이서스코리아", href: "/lecture/detail/16"},
      {text: "#머니테이커", href: "/lecture/detail/9"},
    ],
  ];
  return (
    <Layout bgColor='bg-[#e5e5e514]' padding='py-20 md:py-8'>
      <div className="flex flex-col gap-y-8 md:gap-y-4">
        <div className='text-2xl leading-10 font-bold text-center md:text-sm md:pb-1'>
          찾고 있는 클래스가 있나요? <span className="md:text-lg">🕵🏻</span>
          <br />
          <span className="text-[#00E7FF]">마음에 드는 키워드</span>를 클릭해보세요!
        </div>
      
        <div className='flex flex-col relative overflow-hidden h-[150px] text-black md:h-[150px]'>
          {rows && rows.map( (row, index) => 
            <div
              key={`slider-${index}`}
              className="flex items-center absolute left-0 overflow-hidden whitespace-nowrap h-[50px] md:h-[40px]"
              style={{
                top: `${(index*50).toString()}px`,
                animationName: 'scroll',
                animationDuration: '30s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
                animationDirection: index%2 != 0 ? 'normal' : 'reverse',
              }}>
              {row &&
                [...row, ...row].map( (d, ind) => 
                  <span className="m-1 mx-3 text-center md:mx-2" key={`slider-badge-${ind}`}>
                    <a href={d.href}
                      className="p-1 px-2 rounded-full bg-[#D9D9D9] hover:bg-[#00E7FF]"
                      >
                      {d.text}
                    </a>
                  </span>
                )
              }
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}