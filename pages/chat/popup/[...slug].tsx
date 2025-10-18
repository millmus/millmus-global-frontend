import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useRef, useEffect, useState, PropsWithChildren } from 'react';
import useSWR from 'swr';
import { cls } from '@libs/client/utils';

import Bubble from '@components/chat/bubble';
import Announce from '@components/chat/announce';
import { getHM, isStaff, userName, firebaseConfig, deletedText, ScrollParent, blockedText } from '@components/chat/chat';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, get, query, limitToLast, update } from "firebase/database";

interface IProps {
  slug: number;
}

const messageCut = -2000,
	historyCut = 500;

const Chat: NextPage<IProps> = ({ slug }) => {
	const lid = slug;

  const router = useRouter();
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [messages, setMessages] = useState<any[]>([]);
	const [announce, setAnnounce] = useState('');
	const [totalCount, setTotalCount] = useState(0);
	const [blockMe, setBlockMe] = useState(false);
	const [blockObject, setBlockObject] = useState<any[]>([]);
	const [chatShutdown, setChatShutdown] = useState(false);
	const { data: user } = useSWR('/api/user');

	const app = initializeApp(firebaseConfig);
	const db = getDatabase(app);

	useEffect(() => {
		const announceRef = ref(db, 'announce/'+lid);
		const announceOff = onValue(announceRef, (snapshot) => {
			const message = snapshot.val();
			setAnnounce((prevMessages: string) => message?.content);
		});

		const messagesRef = ref(db, 'messages/'+lid);
		const messagesOff = onValue(messagesRef, (snapshot) => {
			const message = snapshot.val();
			setMessages((prevMessages: any[]) => [...prevMessages.slice(messageCut), message]);
		});

		const deleteRef = ref(db, 'delete/'+lid);
		const deleteOff = onValue(deleteRef, (snapshot) => {
			const message = snapshot.val();
			setMessages((prevMessages: any[]) => {
				const index = prevMessages?.findIndex((d) => d?.mid == message?.mid);
				if (prevMessages[index]) {
					prevMessages[index].content = deletedText;
				}
				return [...prevMessages];
			});
		});

		const blockUserRef = ref(db, 'block/');
		const blockUserOff = onValue(blockUserRef, (snapshot) => {
			const blockedUsers = snapshot.val();
			setBlockObject(blockedUsers);
		});

		// 채팅 종료 상태 확인
		const controlRef = ref(db, 'control/' + lid);
		const controlOff = onValue(controlRef, (snapshot) => {
			const control = snapshot.val();
			if (control?.shutdown === true) {
				setChatShutdown(true);
			} else {
				setChatShutdown(false);
			}
		});

		const dbRef = query(ref(db, `total/${lid}`), limitToLast(historyCut));
		get(dbRef).then((snapshot) => {
		  if (snapshot.exists()) {
		    const old = snapshot.val();
		    const obj = Object.entries(old).map(([key, value]: any) => ({mid: key, ...value}));
		    setMessages(obj);
		  }
		}).catch((error) => {
		  console.error('error', error);
		});

		return () => {
	 		announceOff();
	 		messagesOff();
	 		deleteOff();
	 		blockUserOff();
	 		controlOff();
		};
	}, []);

	useEffect(() => {
		const username = user?.profile?.username;
		if (blockObject[username] == true) {
			setBlockMe(true);
			alert(blockedText);
			router.push("/");
		} else {
			setBlockMe(false)
		}
	}, [blockObject]);
	
	function sendMessage() {
		const inputText = inputRef?.current?.value;
		if (!inputText) return;
		if (!inputText?.length) return;
		if (!inputText?.trim().length) return;

		const username = userName(user),
			appendTotalMessage = push(ref(db, 'total/'+lid)),
			mid = appendTotalMessage?.key ?? username + new Date().getTime(),
			userMessage = {
				user: username, 
				uid: user?.profile?.username, 
				user_grade: user?.profile?.grade ?? false,
				is_staff: isStaff(user), 
				time: getHM(),
				content: inputText
			};

		inputRef.current.value = '';
		set(ref(db, 'messages/'+lid), {
			mid,
			...userMessage
		});
		set(appendTotalMessage, userMessage);
	};
	function deleteMessage(mid: string) {
		if (!mid) return;
		set(ref(db, 'delete/'+lid), {
			mid,
		});
		const updates: any = {};
		updates[`/total/${lid}/${mid}/content`] = deletedText;
		update(ref(db), updates);
	}
	function blockUser(userId: string) {
		const obj = {};
		set(ref(db, 'block/'+userId), true);
	}
	function makeAnnounce(content: string) {
		set(ref(db, 'announce/'+lid), {
			content,
		});
	}
	function clearAnnounce() {
		set(ref(db, 'announce/'+lid), {
			content: '',
		});
	}

	function userClick(username: string) {
		if (!inputRef?.current) return;
		inputRef.current.value = `@${username} ` + inputRef?.current?.value;
	}

	return (
		<>
		<div className="flex flex-col fixed inset-0 z-[99999999] px-2 py-1 text-black bg-white">
			<div className="relative group">
				<Announce announce={announce ?? ''} />
        { isStaff(user) ? 
           <div className="absolute top-2 right-2 z-[10] cursor-pointer bg-white/[0.5] hidden rounded group-hover:block hover:bg-white"
              onClick={() => clearAnnounce()}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-[20px] h-[20px] hover:fill-gray-300">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
           </div> 
           : null
        }
	    </div>

			<ScrollParent>
				{ isStaff(user) ? 
				messages.map((message, index) => (
					message ?
					<li key={index} className="relative group hover:bg-gray-100">
						<Bubble message={message} userClick={userClick}/>

						{message?.is_staff ? 
						<div className="absolute top-2 right-[35px] z-[10] cursor-pointer hidden group-hover:block"
						 	onClick={() => makeAnnounce(message?.content)}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] hover:fill-gray-300">
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
							</svg>
						</div>
						:
						<div className="absolute top-2 right-[35px] z-[10] cursor-pointer hidden group-hover:block"
						 	onClick={() => blockUser(message?.uid)}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] hover:fill-gray-300">
								<path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
							</svg>
						</div>
						}

						<div className="absolute top-2 right-2 z-[10] cursor-pointer hidden group-hover:block"
						 	onClick={() => deleteMessage(message?.mid)}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-[20px] h-[20px] hover:fill-gray-300">
								<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
							</svg>
						</div>
					</li>
					: null
				)) 
				:
				messages.map((message, index) => (
					message ?
					<li key={index} className="relative">
						<Bubble message={message} userClick={userClick}/>
					</li>
					: null
				)) 
				}
			</ScrollParent>
			<div className="flex gap-x-2 group">
			{chatShutdown === true ?
				<div className="flex w-full items-center justify-center p-4 bg-red-500 text-white font-bold">
					<span>채팅창이 곧 닫힙니다.</span>
				</div>
				: blockMe == true ?
				<div className="flex absolute inset-0 bg-[#0f0f0f]/[.6] text-white font-bold">
					<span className="m-auto">관리자에 의해 차단되었습니다.</span>
				</div>
				: 
				<>
				<textarea rows={2}
					className="w-full resize-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
					ref={inputRef}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							sendMessage();
						}
					}}
					onChange={(e) => {
						if (inputRef?.current) inputRef.current.value = e.target.value;
					}}
				></textarea>
				<button className="flex w-[100px] h-[40px] m-auto items-center justify-center rounded-sm leading-3 text-[#14161a] transition-[background-color] group-focus-within:bg-[#00e7ff]" onClick={sendMessage}>전송</button>
				</>
			}
			</div>
		</div>
		</>
	);
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      slug: ctx.params?.slug,
    },
  };
};

export default Chat;