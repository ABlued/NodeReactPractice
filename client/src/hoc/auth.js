import React,{useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {auth} from '../_actions/user_action'
export default function(SpecificComponent, option, adminRoute = null){
    // option 인자는 nul, true, false가 들어갈 수 있다.
    // null -> 아무나 출입이 가능한 페이지
    // true -> 로그인한 유저만 출입이 가능한 페이지
    // false -> 로그인한 유저는 출입이 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response);
                // 로그인 하지 않은 상태
                if(!response.payload.isAuth){   
                    if(option){     // 로그인하지 않았는데 회원페이지로 갈경우
                        props.history.push('/login')
                    }                    
                } else { // 로그인한 상태
                    if(adminRoute && !response.payload.isAdmin){        // 관리자가 아닌데 관리자페이지로 갈경우
                        props.history.push('/')
                    } else {        // 로그인을 했는데 로그인페이지에 갈 경우
                        if(option === false){       
                            props.history.push('/')
                        }
                    }
                }

            })
        }, [])
        return(
            <SpecificComponent/>
        )
    }
    
    return AuthenticationCheck
}