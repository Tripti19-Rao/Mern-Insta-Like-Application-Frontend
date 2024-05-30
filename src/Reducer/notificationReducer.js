export default function notificationsReducer(state, action){
    switch(action.type){
        case 'ADD_NOTIFICATIONS':{
            return {...state, data:[action.payload, ...state.data]}
        }
        case 'UPDATE_NOTIFICATION':{
            return {...state, data:state.data.map((ele)=>{
                if(ele.id===action.payload ){
                    return {...ele, seen:true}
                }
                else{
                    return ele
                }
            })}
        }
        case 'UPDATE_ALL':{
            return {...state, data:state.data.map((ele)=>{
                return { ...ele, seen:true}
            })}
        }
        default : {
            return {...state}
        }
    }
}