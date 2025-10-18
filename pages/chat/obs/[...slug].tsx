import type { GetServerSidePropsContext, NextPage } from 'next';
import { useRef, useEffect, useState, PropsWithChildren } from 'react';
import useSWR from 'swr';
import { cls } from '@libs/client/utils';

import Bubble from '@components/chat/bubble';
import Announce from '@components/chat/announce';
import { getHM, isStaff, userName, firebaseConfig, deletedText, ScrollParent } from '@components/chat/chat';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, get, query, limitToLast, update } from "firebase/database";

interface IProps {
  slug: number;
}

const messageCut = -1000,
	historyCut = 300;

const Chat: NextPage<IProps> = ({ slug }) => {
	const lid = slug;

	const [messages, setMessages] = useState<any[]>([]);
	const [announce, setAnnounce] = useState('');
	const [totalCount, setTotalCount] = useState(0);
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
		};
	}, []);

	return (
		<div className="flex flex-col fixed inset-0 z-[99999999] px-2 py-1 text-black bg-white">
			<div className="relative group">
				<Announce announce={announce} />
      </div>

			<ScrollParent atBottom={true}>
				{
				messages.map((message, index) => (
					<li key={index} className="relative">
						<Bubble message={message} userClick={(username: string)=>{}}/>
					</li>
				)) 
				}
			</ScrollParent>
		</div>
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