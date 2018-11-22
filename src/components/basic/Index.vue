<template>
    <div class="container_inner" style="background: #fff">
        <div class="art_titBox">
            <div class="tit">
                {{title}}
            </div>
            <div class="tit_from">
                <span style="color:#999999">来自 </span>
                <span style="color: #6b3155">{{author}}</span>
            </div>
            <div class="tit_btm">
                {{likes}} 人赞了文章
            </div>
        </div>
        <div v-html="article" class="articles">
        </div>
        <div class="commentSpace">
            <a class="spaceImg" name="commentspace" id="commentspace">
                <div style="color: #999999;font-weight: bold;border-left:2px solid #E3c7aa;">
                    &nbsp;&nbsp;留言区
                </div>
                <div style="color: #E3c7aa" v-on:click="comment">
                    写留言
                </div>

            </a>
            <ul class="comment-list" v-for="(comment, index) in commentList" :key="index">
                <li>
                    <div class="comment-list__left">
                        <img src="https://file.gorkor.com/image/5bdbee823cdea20007a051b2" alt="头像" v-if="comment.gender === 0">
                        <img src="https://file.gorkor.com/image/5bdbee673cdea20007a051b0" alt="头像" v-else>
                    </div>
                    <div class="comment-list__right">
                        <div class="right__title">
                            <div>
                                <span>过客ID&nbsp;&nbsp;{{comment.uid}}</span>

                            </div>

                        </div>
                        <div class="right__time">
                            <span>{{ comment.createTime | moment("YYYY-MM-DD HH:mm") }}</span>
                        </div>

                        <div class="right__content">
                            <span>{{comment.comment}}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="article_foot">
            <div class="foot_box" v-if="liked">
                <!--未赞-->
                <div>
                    <img src="../../common/image/magazineLiked.png" height="18" width="18">
                </div>
                <div class="foot_boxInfo" style="color: #E3C7AA;">
                    赞&nbsp;{{likes}}
                </div>

            </div>
            <div class="foot_box" v-on:click="postlike" v-else>
                <!--未赞-->
                <div>
                    <img src="../../common/image/magazineLike.png" height="18" width="18">
                </div>
                <div class="foot_boxInfo">
                    赞&nbsp;{{likes}}
                </div>
            </div>
            <div class="foot_box">
                <a href="javascript:void(0)" v-on:click="go">
                    <div style="text-align: center">
                        <img src="../../common/image/magazineComment.png" height="18" width="18">
                    </div>
                    <div class="foot_boxInfo" style="color: #8F8F8F;">
                        留言&nbsp;{{commentLen}}
                    </div>
                </a>
            </div>
            <!--share-->
            <div class="foot_box" v-on:click="share(type)">
                <div>
                    <div style="text-align: center">
                        <img src="../../common/image/magazineShare.png" height="18" width="18">
                    </div>
                    <div class="foot_boxInfo">
                        分享
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                author: '',
                article: '',
                articleId: '',
                title: '',
                likes: '',
                liked: false,
                busy: false,
                commentList: [],
                commentLen: ''
            }
        },
        mounted: function () {
            let self = this;
            // 标题
            self.$http.get("/api/magazine/article/3", {

            }, result => {
                self.likes = result.like;
                self.liked = result.liked;
                self.title = result.title;
                self.author = result.author;
                self.article = result.body;
            });
            self.$http.get('https://miniapp.gorkor.com/api/magazine/comment/3'  + '?sortType=0', {

            }, result => {
                self.commentList = self.commentList.concat(result);
                self.commentLen = self.commentList.length
            });
        },
        methods: {
            postlike: function () {
                let self = this;
                if (self.liked) {
                    return;
                } else {
                    self.$post("/api/prop/magazine/postLike", {
                        data: JSON.stringify({
                            articleId: self.articleId
                        })
                    }, result => {
                        self.liked = true;
                        self.likes = self.likes + 1;
                        GK.toast('已点赞');
                    })
                }
            },
            share: function () {
                self.$http.get('/api/user/icode', {
                    _baseURL: GK.getHost()
                }, result => {
                    GK.plus.share({
                        platformType: 'wechatSession',
                        webpageUrl: '/share.html?icode=' + result.toUpperCase(),
                        screenshots: 1
                    });
                });
            },
            comment: function () {
                let self = this;
                GK.plus.input({
                    title: "留言",
                    rightBarName: "添加",
                    placeholder: "请输入留言内容"
                }, function (resultData) {
                    self.$post("/api/prop/magazine/postComment", {
                        data: JSON.stringify({
                            articleId: self.articleId,
                            comment: resultData,
                        })
                    }, result => {
                        self.commentLen = self.commentLen + 1;
                        self.commentList.unshift(result);
                        GK.plus.toast("已添加留言");
                    });
                });
            },
            go: function () {
                window.scrollTo(0, document.getElementById('commentspace').offsetTop);
            }
        }
    }

</script>

<style scoped src="../../common/style/readmagazine.css"/>

<style scoped>


    .articles {
        padding: 20px 30px 0;
    }

    .art_titBox {
        padding: 20px 36px 0;
        color: #3A3A3A;
    }

    .tit {
        font-size: 48px;
        font-weight: bold;
    }

    .tit_from {
        font-size: 36px;
        padding: 20px 0;
    }

    .tit_btm {
        font-size: 28px;
        color: #999999;
    }

    .article_foot {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100px;
        background: rgba(255, 255, 255, 0.95);
        border-top: 1px solid #F6F6F6;
    }

    .foot_box {
        width: 33.33%;
        height: 100%;
        font-size: 24px;
        color: #8F8F8F;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .foot_boxInfo {
        padding-top: 8px;
    }

    .spaceImg {
        width: 100%;
        padding: 0 30px 20px;
        margin: 0 auto;
        font-size: 28px;
        display: flex;
        justify-content: space-between;
    }

    .commentSpace {
        padding-bottom: 130px;
    }

    .comment-list {
        display: flex;
        flex-direction: column;
        background: #fff;
    }

    .comment-list li {
        display: flex;
        padding: 30px 30px;
        border-bottom: 1px solid #F6F6F6;
    }

    .commentSpace ul:last-child li {
        border: none;
    }

    .comment-list__left {
        width: 100px;
    }

    .comment-list__left > img {
        width: 70px;
        height: 70px;
    }

    .comment-list__right {
        width: 590px;
        position: relative;
    }

    .right__title {
        font-size: 28px;
        color: #3E3E3E;
        height: 40px;
    }

    .right__time {
        font-size: 24px;
        color: #C8C8C8;
    }

    .right__content {
        padding-top: 20px;
        font-size: 28px;
    }

</style>