import type { NextPage } from 'next';
import Chat from '@components/chat/chat';

const Test: NextPage = () => {
  function fullScreen() {
    var e = document.getElementById("yt");
    if (e.requestFullscreen) {
        e.requestFullscreen();
    } else if (e.webkitRequestFullscreen) {
        e.webkitRequestFullscreen();
    } else if (e.mozRequestFullScreen) {
        e.mozRequestFullScreen();
    } else if (e.msRequestFullscreen) {
        e.msRequestFullscreen();
    }
  }
  return (
    <>
    <div className="justify-center flex p-4"><Chat/></div>
    </>
  );
};

export default Test;
