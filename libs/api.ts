import axios from 'axios';

// export const API_URL = 'http://127.0.0.1:8000';
export const API_URL = 'https://api-global.xn--o22bp6a0zk.com';
// export const API_URL = 'https://test.xn--o22bp6a0zk.com';
// export const API_URL = 'http://192.168.0.145:8000';
 
const api = axios.create({
  baseURL: API_URL,
});

interface IProps {
  [key: string]: any;
}

export const usersApi = {
  // sns 회원가입
  snsSignup: ({ type, id, name, phoneNum, nickname, adAgree }: IProps) =>
    api.post('/users/signup/', {
      signup_method: type,
      sns_id: id,
      name,
      nickname,
      phone_number: phoneNum,
      ad_agree: adAgree,
    }),

  // 로그인(NextJS api)
  loginNextApi: (req: IProps) => axios.post('/api/login', req),

  // sns 로그인
  snsLogin: ({ type, id, phone_number, nickname, is_signup, ad_agree }: IProps) =>
    api.post('/users/login/', {
      login_method: type,
      sns_id: id,
      phone_number,
      nickname,
      is_signup,
      ad_agree
    }),

  // 로그아웃(NextJS api)
  logoutNextApi: () => axios.post('/api/logout'),

  // 마이페이지 내 정보
  myInfos: (token: string) =>
    api.get('/mypage/', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),

  // 마이페이지 회원 정보 수정
  editInfos: ({ name, nickname, phoneNum, password, adAgree, token }: IProps) =>
    api.post(
      '/mypage/',
      {
        ...(name && { name }),
        ...(nickname && { nickname }),
        ...(phoneNum && { phone_number: phoneNum }),
        ...(password && { password }),
        ad_agree: adAgree,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  // 회원탈퇴
  withdraw: ({ withdrawalReason, token }: IProps) =>
    api.post(
      '/users/withdraw/',
      {
        ...(withdrawalReason && { withdrawal_reason: withdrawalReason }),
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  // 마이페이지 알림 리스트
  myNotificationList: (page: string, token: string) =>
    api
      .get(`/mypage/notification?page=${page}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 마이페이지 알림 읽기
  readNotification: (id: number, token: string) =>
    api.put(`/mypage/notification/`, {
      data: {
        my_notification_pk: id,
      },
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    }).then((res) => res.data),

  // 마이페이지 알림 모두 읽기
  readAllNotification: (token: string) =>
    api.post(`/mypage/notification/`, {
    },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),//.then((res) => res.data),

  // 마이페이지 알림 삭제
  deleteNotification: (id: number, token: string) =>
    api.delete(`/mypage/notification/`, {
      data: {
        my_notification_pk: id,
        delete_all: false,
      },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),
  // 마이페이지 알림 모두 삭제
  deleteAllNotification: (token: string) =>
    api.delete(`/mypage/notification/`, {
      data: {
        delete_all: true,
      },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),

  // 마이페이지 내 강의 리스트
  myLectureList: (completed: boolean, page: string, token: string) =>
    api
      .get(`/mypage/registered_lecture?completed=${completed}&page=${page}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 마이페이지 커뮤니티 리스트
  myCommunityList: (page: string, token: string) =>
    api
      .get(`/mypage/community?page=${page}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 마이페이지 구매 리스트
  myPurchaseList: (page: string, token: string) =>
    api
      .get(`/mypage/payment?page=${page}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 마이페이지 쿠폰 리스트
  myCouponList: (page: string, token: string) =>
    api
      .get(`/mypage/coupon?page=${page}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 마이페이지 포인트 리스트
  myPointList: (page: string, token: string) =>
    api
      .get(`/mypage/point?page=${page}`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 환불 요청
  requestRefund: (merchant_uid: string, reason: string, token: string) =>
    api.post('/payment/refund/', {
      merchant_uid,
      reason,
    }, {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),
};

export const lecturesApi = {
  // 메인배너
  mainBannerList: () => api.get('/cms/main_banner/').then((res) => res.data),

  // 코인 강의 리스트
  coinClassList: () => api.get('/cms/coin_class/').then((res) => res.data),

  // 프리미엄 강의 리스트
  premiumClassList: () => api.get('/cms/premium_class/').then((res) => res.data),

  // 메인페이지
  mainLectureList: () => api.get('/cms/main/').then((res) => res.data),

  // 클래스 Best 페이지 Top3 강의 리스트
  topLectureList: () => api.get('/cms/class/').then((res) => res.data),

  // 카테고리별 강의 리스트
  lectureList: (category: string, page: string) =>
    api
      .get(`/lectures?category=${category}&page=${page}`)
      .then((res) => res.data),

  // 강의 상세
  detail: (id: string, token?: string | null) =>
    api
      .get(`/lectures/${id}/`, {
        ...({
          headers: {
            // Authorization: token,
            'Content-Type': 'application/json',
          },
        }),
      })
      .then((res) => res.data),

  // 강의 상세 리뷰쓰기
  writeReview: (formData: FormData, token: string) =>
    api.post(
      '/lectures/review/',
      formData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  // 강의 상세 리뷰 수정
  editReview: (formData: FormData, token: string) =>
    api.put(
      `/lectures/review/`,
      formData,
      {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      }
    ),

  // 강의 상세 리뷰 삭제
  deleteReview: (id: number, token: string) =>
    api.delete(`/lectures/review/`, {
      data: {
        lecture_review_pk: id,
      },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),

  // 강사 리스트
  tutorList: (page: string) =>
    api.get(`/lectures/tutor?page=${page}`).then((res) => res.data),

  // 마이페이지 내 강의 수강
  myLectureDetail: (id: string, token: string) =>
    api
      .get(`/lectures/registered_lecture/${id}/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 강의 수강완료
  finishLecture: ({ id, order, token }: IProps) =>
    api.post(
      `/lectures/registered_lecture/${id}/`,
      { order },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),
  search: (search: string) => api.get(`/lectures/search?q=${search}`).then((res) => res.data),

  // 강사지원
  applyTutor: ({
    name,
    phone,
    email,
    sns,
    subject,
    reference,
    oldPlatform,
  }: IProps) =>
    api.post(
      '/lectures/apply/tutor/',
      {
        name,
        phone,
        email,
        sns,
        subject,
        reference,
        oldPlatform,
      },
    ),
};

export const communityApi = {
  communityList: () => api.get('/community/').then((res) => res.data),

  communityBoard: ({
    category,
    page,
    orderType,
    searchType,
    searchTerm,
    token,
  }: IProps) =>
    api
      .get(
        `/community/${category}?page=${page}&filter_keyword=${orderType}&search_keyword=${searchType}&search=${searchTerm || ''
        }`,
        {
          ...(token && {
            headers: {
              Authorization: token,
              'Content-Type': 'application/json',
            },
          }),
        }
      )
      .then((res) => res.data),

  getDetail: (category: string, id: string, token: string) =>
    api
      .get(`/community/${category}/${id}/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  writeDetail: (
    category: string,
    subject: string,
    title: string,
    content: string,
    token: string
  ) =>
    api.post(
      `/community/${category}/`,
      {
        subject,
        title,
        content,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  editDetail: (
    category: string,
    id: string,
    subject: string,
    title: string,
    content: string,
    token: string
  ) =>
    api.put(
      `/community/${category}/`,
      {
        post_pk: id,
        subject,
        title,
        content,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  deleteDetail: (category: string, id: string, token: string) =>
    api.delete(`/community/${category}/`, {
      data: {
        post_pk: id,
      },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),

  toggleLike: (id: string, token: string) =>
    api.post(
      `/community/post/like/`,
      { post_pk: id },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  writeReview: (id: string, text: string, token: string) =>
    api.post(
      `/community/post/reply/`,
      { post_pk: id, text },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  // 강의 상세 리뷰 수정
  editReview: (id: number, text: string, token: string) =>
    api.put(
      `/community/post/reply/`,
      {
        reply_pk: id,
        text,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  // 강의 상세 리뷰 삭제
  deleteReview: (id: number, token: string) =>
    api.delete(`/community/post/reply/`, {
      data: {
        reply_pk: id,
      },
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),
};

export const purchaseApi = {
  // 결제페이지 내 정보
  myData: (token: string) =>
    api.get('/payment/user/', {
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    }),

  // 결제했던 정보 체크
  check: (type: string, id: number, token: string, option: string = "-1") =>
    api
      .get('/payment/check/', {
        params: {
          type,
          ...(type === 'lecture' ? { lecture_pk: id, option: option } : { community_pk: id }),
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data),

  // 결제했던 정보 체크
  myLectureID: (id: number, token: string, option: string = "-1") =>
    api
      .get('/payment/check/', {
        params: {
          type: 'lecture',
          lecture_pk: id, option: option, get_my_lecture_id: true
        },
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data && res.data > 0 ? res.data : false),

  // 결제
  purchase: ({
    type,
    method,
    id,
    price,
    totalPrice,
    point,
    coupon,
    orderId,
    token,
    option,
  }: IProps) =>
    api.post(
      '/payment/',
      {
        type,
        method,
        ...(type === 'lecture' ? { lecture_pk: id } : { community_pk: id }),
        price,
        payment: totalPrice,
        ...(point && point > 0 && { point }),
        ...(coupon && { coupon_pk: coupon }),
        payment_id: orderId,
        option,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),
  // 입금자명 등록
  addPayerName: ({
    lecture_id,
    payer_name,
    payer_phone,
    cash_receipt_number,
    business_number,
    token 
  }: IProps) =>
    api.post(
      '/payment/cash-payer-info/',
      {
        payer_name,
        payer_phone,
        cash_receipt_number,
        business_number,
        lecture_id,
      },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),
};

export const eventApi = {
  eventList: (page: string) =>
    api.get(`/event?page=${page}`).then((res) => res.data),

  eventDetail: (id: string) => api.get(`/event/${id}`).then((res) => res.data),

  getCoupon: (id: string, token: string) =>
    api.post(
      '/event/coupon/',
      { event_pk: id },
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),

  createWelcomeCoupon: (token: string) =>
    api.get(
      '/event/welcome_coupon/',
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      }
    ),
};

export const popupApi = {
  getPopup: () => api.get(`/cms/popup/`).then((res) => {
    return res.data
  }),
}
