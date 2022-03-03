<template>
	<view class="music-head"  :style="{color:color}">
		<view class="music-head-icon" v-if="icon" :class="{'music-head-iconblack':iconblack}">
			<text class="iconfont iconzuojiantou-copy" @tap="handleToBack"></text>|<text class="iconfont iconshouye" @tap="handleToHome"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:['title','icon','color','iconblack'],
		methods:{
			handleToHome(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			handleToBack(){
				uni.navigateBack();
			}
		}
	}
</script>

<style scoped>
	.music-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px; 
		text-align: center;
		color: black;
		position: relative;
	}
	.music-head-icon{
		position: absolute;
		left:8px;
		top:23px;
		width: 90px;
		height: 31px;
		background-color: rgba(0,0,0,0.4);
		color: white;
		line-height: 31px;
		border-radius: 15px;
		display: flex;
		justify-content: space-evenly;
		
	}
	
	.music-head-iconblack{
		color: black;
		border: 1px #eaeaea solid ;
		background-color: white;
	}
</style>
