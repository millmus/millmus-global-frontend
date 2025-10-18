// components/customImage.js
const CustomImage = (props) => {
    return (
      // 이미지 비활성화를 위해 빈 div를 반환하거나 기본 img 태그를 사용하지 않는 방법 선택
      <div style={{ display: 'none' }}>
        {/* <img src={props.src} alt={props.alt} width={props.width} height={props.height} /> */}
      </div>
    );
  };
  
  export default CustomImage;
  