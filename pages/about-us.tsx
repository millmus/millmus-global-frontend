import SEO from '@components/seo';
import type { NextPage } from 'next';
import Image from "next/image";
import AboutUsImage from "@public/home/about-us.jpeg";
import Signature from "@public/home/signature.png";
import { useEffect } from 'react';

const AboutUs: NextPage = () => {
  useEffect(() => {
    console.log('AboutUs');
  }, [])
  return (
    <>
      <SEO
        title='회사소개'
        description='밀레니얼 머니스쿨 회사소개 페이지 입니다.'
      />
      <div style={{padding: '100px', textAlign: 'center', width: '100%', fontWeight: 700,
        fontSize: '32px',
        lineHeight: '46px',
        background: 'rgba(0, 0, 0, 0.2)',
        color: '#FFFFFF'}}>
        <p>
          회사소개
        </p>
      </div>
      <div style={{display: "flex", justifyContent: "center"}}>
        <div className="flex p-[60px] flex-col max-w-[1024px] md:max-w-[330px] md:p-0 md:pt-[48px] md:pb-[48px]" >
          <div className="flex md:flex-col">
            <div className="flex max-w-[480px] mr-[40px] mb-[32px] md:mb-[24px] md:mr-0 object-contain">
              <Image
                src={AboutUsImage}
                alt='대표자 사진'
                objectFit='cover'
                placeholder='blur'
                quality={100}
                objectPosition='top'
              />
            </div>
            <div style={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '160%',
            }}>
              {/* 안녕하세요,<br/>
              밀레니얼머니스쿨 창업자 신희은입니다.<br/>
              <br/>
              실전고수에게 배우는 투자교육 플랫폼 밀레니얼머니스쿨은 경제적 자유를 꿈꾸지만 어디서부터, 무엇부터 시작해야 할지 막막한 2030을 위한 공간입니다.<br/>
              <br/>
              10년차 경제전문기자로 평범한 직장인과 다르지 않은 삶을 살았던 저는 경제 유튜브 {'<싱글파이어>'}를 기획하고 70명이 넘는 젊은 자산가들을 인터뷰하면서 세상을 보는 관점이 달라졌습니다.<br/>
              <br/>
              우리가 경제적 자유를 이뤄야 하는 이유는, 막연히 수십억대 자산가가 되기 위해서가 아니더군요. 한 번 뿐인 소중한 인생의 시간을 사랑하는 사람들과 보내고, 하고 싶은 일을 마음껏 하면서 살아야 하기 때문이더라고요.<br/>
              <br/> */}
              안녕하세요,<br />
주식회사 밀레니얼머니스쿨 창업자 신희은입니다.<br />
<br />
밀머스는 교육에 수천만원 써본 프로수강러이자 13년차 경제전문기자가 창업한 교육기업입니다. 경제적 자유를 꿈꾸지만 어디서부터, 무엇부터 시작해야 할지 막막한 분들을 위한 제대로 된 성장 공간을 만들겠다는 꿈으로 시작했습니다.<br />
<br />
끝까지 듣고 성과나는 프리미엄 클래스, 밀머스가 지향하는 가치입니다. 새로운 세상을 배워서 가슴이 뛰고 수강이 끝나는 걸 아쉬워하며 끝까지 듣는 교육, 듣고 의미있는 변화를 만들어내는 교육을 지향합니다.<br />
<br />
경제유튜브 {`<싱글파이어>`}를 기획하고 70명이 넘는 젊은 자산가들을 인터뷰하면서 저는 세상을 보는 관점이 달라졌습니다. 우리가 경제적 자유를 이뤄야 하는 이유는 막연히 수십억대 자산가가 되기 위해서가 아니더군요.<br /><br />
            </div>
          </div>
          <div>
            {/* 근로소득만으로는 슬프게도 이런 자유를 얻을 수 없는 게 자본주의의 현실입니다. 투자를 기초부터 차근히 제대로 배워서 어느 순간에는 월급에서 자유로워지는 게 해답입니다.<br/>
            <br/>
            밀레니얼머니스쿨은 경제적 자유를 꿈꾸는 2030이 그 길을 미리 걸어본 멘토들과 함께 더 빠르게 성장할 수 있도록 돕는 일에 최선을 다하겠습니다.<br/>
            <br/>
            스스로를 자유롭게 하는 길을 선택한 여러분을 진심으로 응원합니다.<br/> */}
            한 번 뿐인 소중한 인생의 시간을 사랑하는 사람들과 보내고, 하고 싶은 일을 마음껏 하면서 살아야 하기 때문이더라고요. 근로소득만으로는 슬프게도 이런 자유를 얻을 수 없는 게 우리가 사는 자본주의의 현실입니다.<br />
            <br />
평범한 사람들도 투자소득, 사업소득을 통해 경제적 자유에 가까워질 수 있도록 돕겠습니다. 낯선 세상이라도 쉽게, 재미있게 다가가 결국은 내 세상으로 만들 수 있도록 지원하겠습니다.<br />
<br />
밀머스는 경제적 자유를 꿈꾸는 분들이 그 길을 미리 걸어본 각 분야 최고의 멘토들과 함께 더 빠르게 성장할 수 있도록 돕는 일에 최선을 다하겠습니다<br />
<br />
스스로를 자유롭게 하는 길을 선택한 여러분을 진심으로 응원합니다.<br />
<br />
고객의 경제적 성장이 밀머스와 멘토님들이 목표하는 최고의 가치입니다.<br />
<br />
밀머스에 찾아와 주셔서, 함께 성장해주셔서 감사드립니다.<br />
<br />
<br />
밀레니얼머니스쿨 대표이사 신희은<span
  style={{
    position: 'absolute',
    width: '100px',
    marginLeft: '10px',
    marginTop: '-5px',
  }}
><Image
                src={Signature}
                alt='대표자 서명'
                objectFit='cover'
                placeholder='blur'
                quality={100}
                objectPosition='top'
              /></span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
