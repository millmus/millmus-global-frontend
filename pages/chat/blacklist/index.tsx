import { useRef, useEffect, useState } from 'react';
import useSWR from 'swr';

import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from "firebase/database";

import { isStaff } from '@components/chat/chat';

const firebaseConfig = {
  databaseURL: "https://millmus-live-default-rtdb.firebaseio.com/",
};

const Chat = () => {
	const { data: user } = useSWR('/api/user');
	const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

	const app = initializeApp(firebaseConfig);
	const db = getDatabase(app);

	useEffect(() => {
		const blockUserRef = ref(db, 'block/');
		const blockUserOff = onValue(blockUserRef, (snapshot) => {
			const old = snapshot.val();
			setBlockedUsers(old)
		});

		return () => {
	 		blockUserOff();
		};
	}, []);

	function unblockUser(userId: string) {
		const obj = {};
		set(ref(db, 'block/'+userId), false);
	}
	if (!isStaff(user)) return null;
	return (
		<div className="flex flex-col fixed inset-0 z-[99999999] px-2 py-1 text-black bg-white">
			{blockedUsers ? 
			<ul className="w-full h-full overflow-y-auto">
				<li className="text-center font-bold text-lg border-b">차단된 유저 목록</li>
				{Object.entries(blockedUsers).map(([userId, value], index) => (
					value == true ?
					<li className="flex w-full max-w-[150px] mx-auto px-2 items-center justify-between py-2 text-center hover:bg-gray-100" key={`chat-m-${index}`}>
					 	<div>{userId}</div>
						<div className="cursor-pointer" onClick={() => unblockUser(userId)}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
							  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>
						</div>
					</li>
					:
					null
				))}
			</ul>
			:
			<div>차단된 유저가 없습니다.</div>
			}
		</div>
	);
};

export default Chat;

