<template>
	<view>
		<musichead title="搜索" icon="true" :iconblack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				
					<view class="search-search">
						<text class="iconfont iconsearch"></text>
						<input type="text" value="" placeholder="搜索歌曲" v-model="searchWord"
							@confirm="handleToSearch(searchWord)" @input="handleToSuggest"/>
						<text v-show="searchType!=1" class="iconfont iconguanbi" @tap="handleToClose"></text>
					</view>
					<block v-if="searchType == 1">
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont iconlajitong" @tap="handleToClear()"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index" @tap="handleHotWord(item)">{{item}}
							</view>

						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-head">
							热搜榜
						</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index"
							@tap="handleHotWord(item.searchWord)">
							<view class="search-hot-top">
								{{index+1}}
							</view>
							<view class="search-hot-word">
								<view>
									{{item.searchWord}}
									<image :src="item.iconUrl" mode="aspectFit"></image>
								</view>
								<view>
									{{item.content}}
								</view>
							</view>
							<text class="search-hot-count">{{item.score}}</text>
						</view>
					</view>
					</block>
			
				<block v-else-if="searchType==2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.artists[0].name}}-{{item.album.name}}</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>
					</view>
				</block>
				<block v-else-if="searchType==3">
					<view class="search-suggest">
						<view class="search-suggest-head">
							搜索:{{this.searchWord}}
						</view>
						<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="handleHotWord(item.keyword)">
							<text class="iconfont iconsearch"></text>{{item.keyword}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>


	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import '@/common/iconfont.css'
	import {
		searchHot,
		searchWord,
		searchSuggest
	} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchWord: '',
				searchHistory: [],
				searchType:3,
				searchList:[],
				searchSuggest:[]
			}
		},
		components: {
			musichead
		},
		onLoad() {
			searchHot().then((res) => {
				if (res[1].data.code == '200') {
					this.searchHot = res[1].data.data;
				}
			});
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.searchHistory = res.data;
				}
			})
		},
		methods: {
			handleHotWord(word) {
				this.searchWord = word;
				this.handleToSearch(word);
			},
			handleToSearch(word) {
				this.searchHistory.unshift(word);
				this.searchHistory = [...new Set(this.searchHistory)];
				if (this.searchHistory.length > 10) {
					this.searchHistory.length = 10;
				}

				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				console.log(this.searchWord)
				this.getSearchList(this.searchWord);
			},
			handleToClear() {
				uni.clearStorage({
					key: 'searchHistory',
					success: (res) => {
						this.searchHistory = []
					}
				});
			},
			getSearchList(word){
				searchWord(word).then((res)=>{
					if(res[1].data.code=='200'){
						this.searchList=res[1].data.result.songs;
						this.searchType=2;
					}
				})
			},
			handleToClose(){
				this.searchWord='';
				this.searchType=1;
			},
			handleToDetail(songId){
				console.log(songId);
				uni.navigateTo({
					url:'/pages/detail/detail?songId='+songId,
					method:'GET'
				})
			},
			handleToSuggest(ev){
				let value=ev.detail.value;
				if(!value){
					this.searchType=1;
					return;
				}
				searchSuggest(value).then((res)=>{
					if(res[1].data.code=='200'){
						this.searchSuggest=res[1].data.result.allMatch;
						this.searchType=3;
					}
			
				})
			}
		}
	}
</script>

<style>
	.search-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}

	.search-search text {
		margin: 0 26rpx;
	}

	.search-search input {
		flex: 1;
		font: 26rpx;
	}

	.search-history {
		margin: 40rpx 30rpx;
		font-size: 26rpx;
	}

	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}

	.search-history-list view {
		padding: 16rpx 28rpx;
		border-radius: 40rpx;
		margin-right: 30rpx;
		margin-bottom: 30rpx;
		background-color: #f7f7f7
	}

	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;
	}

	.search-hot-head {
		margin-bottom: 36rpx;
	}

	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
	}

	.search-hot-top {
		color: #DD524D;
		width: 60rpx;
		margin-left: 8rpx;
	}

	.search-hot-word {
		flex: 1;
	}

	.search-hot-word view:nth-child(1) {
		font-size: 30rpx;
		color: #000000;
	}

	.search-hot-word view:nth-child(2) {
		font-size: 24rpx;
		color: #808080;
	}


	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}


	.search-hot-count {
		color: #808080;
	}
	
	.search-result{border-top: 2rpx #e4e4e4 solid; padding: 30rpx;}
	
	.search-result-item{display: flex;justify-content: space-between;align-items: center;margin-bottom: 30rpx;padding-bottom: 30rpx;
	border-bottom: 2rpx #e4e4e4 solid;}
	
	.search-result-word{}
	
	.search-result-word view:nth-child(1){font-size: 28rpx;color: #235790;margin-bottom: 12rpx;}
	
	.search-result-word view:nth-child(2){font-size: 22rpx;color: #898989;}
	
	.search-result-item text{font-size: 50rpx;}
	
	.search-suggest{border-top: 2rpx #e4e4e4 solid; padding: 30rpx;font-size: 26rpx;}
	
	.search-suggest-head{color: #4574a5;margin-bottom: 74rpx;}
	
	.search-suggest-item{color: #5d5d5d;margin-bottom: 74rpx;}
	
	.search-suggest-item text{color: #bdbdbd; margin-right:28rpx;position:relative;top:2rpx;}
</style>
