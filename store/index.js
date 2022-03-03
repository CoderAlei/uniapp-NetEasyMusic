import Vue  from "vue"
import Vuex from 'vuex'

Vue.use(Vuex);
export default new Vuex.Store({
	state :{
		topListIds:[],
		nextId:''
	},
	mutations:{
		INIT_TOPLISTIDS(state,playload){
			state.topListIds=playload
		},
		NEXT_ID(state,playload){
				for(var i = 0;i<state.topListIds.length;i++){
					if(state.topListIds[i].id==playload)
					state.nextId=state.topListIds[i+1].id;
				}
		}
	},
	
});