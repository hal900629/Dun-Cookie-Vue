<template>
  <div id="app">
    <div class="loading-title-area" ref="loading-title-area">
      <el-image class="loading-image" :src="logo"></el-image>
      <div class="loading-title">欢迎使用小刻食堂 V{{ currentVersion }}</div>
    </div>
    <div v-show="bodyIsShow">
      <el-row>
        <div class="head-area" ref="head-area">
          <div class="head">
            <a href="http://www.ceobecanteen.top/" target="_blank">
              <el-image class="img" :src="logo"></el-image>
            </a>
            <div class="name-area">
              <div class="name">小刻食堂</div>
              <div class="version">V {{ currentVersion }}</div>
            </div>
          </div>
          <div class="info-animate">
            <div class="animate">A</div>
            <div class="animate-text-area">
              <div class="animate-text">
                <div>小刻食堂正常运行中</div>
                <div>小刻食堂正常运行中</div>
              </div>
            </div>
          </div>
          <div class="info">
            <div class="info-title">
              <div class="has-cookie">
                小刻已经成功找到
                <countTo
                  :startVal="0"
                  :endVal="dunInfo.cookieCount"
                  :duration="1000"
                ></countTo>
                个饼
              </div>
              <div class="look-cookie">
                进入食堂后找了
                <countTo
                  :startVal="oldDunCount"
                  :endVal="dunInfo.counter"
                  :duration="1000"
                ></countTo>
                次
              </div>
            </div>
            <div class="more-cookie" ref="more-cookie">
              <div>
                小刻在
                {{ formatTime(settings.initTime, "yyyy-MM-dd hh:mm:ss") }}
                进入食堂
              </div>
              <div class="info-time">
                小刻在
                {{ formatTime(dunInfo.lastDunTime, "hh:mm:ss") }} 翻箱倒柜一次
              </div>
            </div>
          </div>
        </div>
      </el-row>
      <div class="body-area" ref="body-area">
        <div class="body-menu-big">
          <div
            class="body-menu-big-left"
            ref="body-menu-big-left"
            @click="changeMenu(0)"
          >
            <div class="menu-card system">
              <span>系统</span>
              <span>设置</span>
            </div>
          </div>
          <div
            class="body-menu-big-right"
            ref="body-menu-big-right"
            @click="changeMenu(1)"
          >
            <div class="menu-card view">
              <span>界面</span>
              <span>设置</span>
            </div>
          </div>
        </div>
        <i
          class="el-icon-back back-btn"
          :class="showBack ? '' : 'btn-hide'"
          @click.stop="changeMenu()"
        ></i>
        <div class="config-btn" :class="showBack ? '' : 'btn-hide'">
          <el-button class="green" @click.stop="saveSetting('form')">
            <i class="el-icon-circle-check"></i>保存
          </el-button>
          <el-button class="purple" @click.stop="settingExport">
            <i class="el-icon-download"></i>导出配置
          </el-button>
          <el-upload
            action="aaa"
            :auto-upload="false"
            :on-change="settingImport"
            ref="upload"
            accept="application/json"
            :show-file-list="false"
          >
            <el-button class="pink">
              <i class="el-icon-upload2"></i>导入配置
            </el-button>
          </el-upload>
        </div>
        <div class="feedback-btn" :class="showBack ? 'btn-hide' : ''">
          <el-button class="green" @click.stop="alertFeedback()">
            <i class="el-icon-circle-check"></i>反馈
          </el-button>
        </div>
        <div class="body-menu-content">
          <el-form
            ref="form"
            class="form"
            :model="settings"
            label-width="100px"
          >
            <div class="system system-form" ref="system-form">
              <div class="body-menu-content-card">
                <div class="content-card-title">饼来源</div>
                <div class="content-card-description">
                  选择勾选来源，最少选择一个
                </div>
                <div class="content-card-content">
                  <el-checkbox-group
                    class="checkbox-group-area"
                    v-model="settings.enableDataSources"
                    :min="1"
                  >
                    <el-checkbox
                      v-for="source of defSourcesList"
                      :key="source.dataName"
                      :label="source.dataName"
                    >
                      <span class="checkbox-area">
                        <img class="icon-img" :src="source.icon" />
                        {{ source.title }}
                      </span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="flex">
                <div class="body-menu-content-card">
                  <div class="content-card-title">微博登录</div>
                  <div class="content-card-description">
                    微博端API有些账户需要登录才能查看最新微博
                  </div>
                  <div class="content-card-content flex-between">
                    <div>
                      点击“查看是否登录成功”按钮，如果能看到微博个人信息，则登录成功<br />
                      如果是登录注册页面，请点击“进入登录页面”按钮重新登录
                    </div>
                    <div>
                      <el-button
                        size="small"
                        @click="
                          openUrl('https://passport.weibo.cn/signin/login')
                        "
                        >进入登录页面
                      </el-button>
                      <el-button
                        size="small"
                        @click="openUrl('https://m.weibo.cn/profile/')"
                        >查看是否登录成功
                      </el-button>
                    </div>
                  </div>
                </div>
                <div class="body-menu-content-card">
                  <div class="content-card-title">蹲饼频率</div>
                  <div class="content-card-description">
                    是多少秒刷新一次，不是一秒刷新多少次
                  </div>
                  <div class="content-card-content flex-between">
                    <div>
                      <span v-if="settings.dun.autoLowFrequency"
                        >低频模式下为{{
                          settings.dun.intervalTime *
                          settings.dun.timeOfLowFrequency
                        }}秒刷新一次</span
                      >
                    </div>
                    <div>
                      <el-input-number
                        controls-position="right"
                        size="small"
                        v-model="settings.dun.intervalTime"
                        :min="12"
                        :max="3600"
                      ></el-input-number>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="body-menu-content-card">
                  <div class="content-card-title">游戏平台</div>
                  <div class="content-card-description">
                    明日方舟游戏常用平台
                  </div>
                  <div class="content-card-content flex-between">
                    <div>分为IOS和安卓，B服同安卓</div>
                    <div>
                      <el-radio-group v-model="settings.dun.gamePlatform">
                        <el-radio label="IOS">IOS</el-radio>
                        <el-radio label="Android">安卓</el-radio>
                      </el-radio-group>
                    </div>
                  </div>
                </div>
                <div class="body-menu-content-card">
                  <div class="content-card-title">推送重复的饼</div>
                  <div class="content-card-description">
                    推送不同平台一样的饼
                  </div>
                  <div class="content-card-content flex-between">
                    <div>关闭后不会推送不同平台同样的饼，列表还是都会显示</div>
                    <div>
                      <el-switch
                        v-model="settings.dun.repetitionPush"
                      ></el-switch>
                    </div>
                  </div>
                </div>
              </div>
              <div class="body-menu-content-card">
                <div class="content-card-title">低频模式</div>
                <div class="content-card-description">
                  时间段内蹲饼的速度降低，用来节省流量和性能
                </div>
                <div class="content-card-content">
                  <div class="flex-between">
                    <div>打开以启用时间调控和频率调节</div>
                    <div>
                      <el-switch
                        v-model="settings.dun.autoLowFrequency"
                      ></el-switch>
                    </div>
                  </div>
                  <div class="body-menu-content-line">
                    <div class="content-line-title">时间调控</div>
                    <div class="content-line-description">
                      低频模式的启用时段
                    </div>
                    <div class="content-line-content">
                      <el-slider
                        v-model="settings.dun.lowFrequencyTime"
                        show-stops
                        :max="24"
                        :marks="marks"
                        :format-tooltip="lowFrequencyTimeTooltip"
                        range
                      >
                      </el-slider>
                    </div>
                  </div>
                  <div class="body-menu-content-line">
                    <div class="content-line-title">频率调节</div>
                    <div class="content-line-description">
                      低频模式下的蹲饼时间(基于正常模式的时间倍率)
                    </div>
                    <div class="content-line-content flex-between">
                      <div>
                        低频模式倍数乘原蹲饼时间为低频模式每次刷新时间间隔
                      </div>
                      <div>
                        <el-input-number
                          controls-position="right"
                          size="small"
                          v-model="settings.dun.timeOfLowFrequency"
                          :min="2"
                          :max="20"
                        ></el-input-number>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="body-menu-content-card">
                  <div class="content-card-title">推送常规消息</div>
                  <div class="content-card-description">推送鹰角の饼</div>
                  <div class="content-card-content flex-between">
                    <div>
                      关闭后仅可以查看列表，无法在电脑右下角和通知栏收到推送！
                    </div>
                    <div>
                      <el-switch
                        v-model="settings.dun.enableNotice"
                      ></el-switch>
                    </div>
                  </div>
                </div>
                <div class="body-menu-content-card">
                  <div class="content-card-title">推送重要公告</div>
                  <div class="content-card-description">推送我们的消息</div>
                  <div class="content-card-content flex-between">
                    <div>
                      关闭后不会在电脑右下角和通知栏收到重要公告推送，如刷活动前刷剿灭提醒与因不明原因导致小刻食堂崩溃！
                    </div>
                    <div>
                      <el-switch
                        v-model="settings.feature.announcementNotice"
                      ></el-switch>
                    </div>
                  </div>
                </div>
              </div>
              <div class="body-menu-content-card">
                <div class="content-card-title">排序规则</div>
                <div class="content-card-description">
                  统一无详细时间的卡片在当天信息流内的位置
                </div>
                <div class="content-card-content flex-between">
                  <div>
                    有些数据比如通讯组是只有日期没有时间的，在数据列表内无法排序，在此统一调整。<br />保存的时候可能会因为数据排序改变而发送错误的推送，请忽略。
                  </div>
                  <div>
                    <el-radio-group v-model="settings.dun.sortModeForOnlyDate">
                      <el-radio :label="1">当天内容顶部</el-radio>
                      <el-radio :label="2">当天内容底部</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
            </div>
            <div class="view view-form" ref="view-form">
              <div class="flex">
                <div class="body-menu-content-card">
                  <div class="content-card-title">主题</div>
                  <div class="content-card-description">黑，白</div>
                  <div class="content-card-content flex-between">
                    <div></div>
                    <el-radio-group v-model="settings.display.darkMode">
                      <el-radio :label="0">日常模式</el-radio>
                      <el-radio :label="1">夜间模式</el-radio>
                      <el-radio :label="-1" title="18点到06点为夜间模式"
                        >自动模式
                      </el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="body-menu-content-card">
                  <div class="content-card-title">字体大小</div>
                  <div class="content-card-description">正常大小16px</div>
                  <div class="content-card-content flex-between">
                    <div></div>
                    <el-radio-group v-model="settings.display.fontSize">
                      <el-radio :label="-1">小</el-radio>
                      <el-radio :label="0">正常</el-radio>
                      <el-radio :label="1">大</el-radio>
                      <el-radio :label="2">特别大</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>
              <div class="flex">
                <div class="body-menu-content-card">
                  <div class="content-card-title">展示图片</div>
                  <div class="content-card-content flex-between">
                    <div>不会影响泰拉记事社等特殊的卡片</div>
                    <div>
                      <el-switch
                        v-model="settings.display.showImage"
                      ></el-switch>
                    </div>
                  </div>
                </div>
                <div class="body-menu-content-card">
                  <div class="content-card-title">显示转发</div>
                  <div class="content-card-description">
                    是否显示被鹰角转发的内容
                  </div>
                  <div class="content-card-content flex-between">
                    <div>
                      转发内容大部分为抽奖结果，为了防止有人吃不了柠檬陷的饼，特意添加此开关。<br />
                      调整此开关会导致源数据改变，可能会有错误的推送！
                    </div>
                    <div>
                      <el-switch v-model="settings.dun.showRetweet"></el-switch>
                    </div>
                  </div>
                </div>
              </div>
              <!-- <div class="flex"> -->
              <div class="body-menu-content-card">
                <div class="content-card-title">分类显示</div>
                <div class="content-card-description">
                  用标签栏分类或者直接全部展示
                </div>
                <div class="content-card-content flex-between">
                  <div>
                    <div v-if="settings.display.showByTag">
                      <!--<el-form-item prop="display.defaultTag"-->
                      <!--              :rules="{required: true, message: '请选择默认标签', trigger: 'blur'}">-->
                      <!--  -->
                      <!--</el-form-item>-->
                      <el-select
                        v-model="settings.display.defaultTag"
                        placeholder="选择默认标签"
                      >
                        <el-option
                          v-for="source in currentDataSource"
                          :key="source.dataName"
                          :label="source.title"
                          :value="source.dataName"
                        >
                          <div style="display: flex; align-items: center">
                            <img
                              :src="source.icon"
                              style="width: 25px; margin-right: 10px"
                            />
                            <span>{{ source.title }}</span>
                          </div>
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div style="height: 40px; line-height: 40px">
                    <el-switch v-model="settings.display.showByTag"></el-switch>
                  </div>
                </div>
              </div>
              <div class="body-menu-content-card">
                <div class="content-card-title">窗口化</div>
                <div class="content-card-content">
                  <div class="body-menu-content-line">
                    <div class="content-line-title">列表窗口化</div>
                    <div class="content-line-description">
                      点开列表以窗口弹出
                    </div>
                    <div class="content-line-content flex-between">
                      <div></div>
                      <el-switch
                        v-model="settings.display.windowMode"
                      ></el-switch>
                    </div>
                  </div>
                  <div class="body-menu-content-line">
                    <div class="content-line-title">弹窗最大化</div>
                    <div class="content-line-description">
                      列表打开快速跳转链接时，自动最大化窗口
                    </div>
                    <div class="content-line-content flex-between">
                      <div></div>
                      <el-switch v-model="settings.feature.linkMax"></el-switch>
                    </div>
                  </div>
                </div>
              </div>
              <div class="body-menu-content-card">
                <div class="content-card-title">公告</div>
                <div class="content-card-content">
                  <div class="body-menu-content-line">
                    <div class="content-line-title">公告滚动</div>
                    <div class="content-line-description">
                      公告随着时间线卡片一起滚动
                    </div>
                    <div class="content-line-content flex-between">
                      <div></div>
                      <el-switch
                        v-model="settings.display.announcementScroll"
                      ></el-switch>
                    </div>
                  </div>
                  <div class="body-menu-content-line">
                    <div class="content-line-title">理智提醒</div>
                    <div class="content-line-description">
                      用于公告栏计算理智回复
                    </div>
                    <div class="content-line-content flex-between">
                      <div>
                        <el-input-number
                          v-if="settings.feature.san"
                          placeholder="理智上限"
                          controls-position="right"
                          size="small"
                          v-model="settings.san.maxValue"
                          :min="80"
                          :max="135"
                        ></el-input-number>
                      </div>
                      <div style="height: 40px; line-height: 40px">
                        <el-switch v-model="settings.feature.san"></el-switch>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import countTo from "vue-count-to";

import Settings from "../common/Settings";
import DunInfo from "../common/sync/DunInfo";
import { SHOW_VERSION } from "../common/Constants";
import { getDefaultDataSourcesList } from "../common/datasource/DefaultDataSources";
import TimeUtil from "../common/util/TimeUtil";
import {
  customDataSourceTypes,
  customDataSourceTypesByName,
} from "../common/datasource/CustomDataSources";
import { animateCSS, deepAssign } from "../common/util/CommonFunctions";
import PlatformHelper from "../common/platform/PlatformHelper";
import "animate.css";
import CurrentDataSource from "../common/sync/CurrentDataSource";

export default {
  name: "app",
  components: { countTo },
  // Feedback
  created() {},
  mounted() {
    this.init();
    this.initAnimate();
  },
  watch: {},
  data() {
    getDefaultDataSourcesList().then((res) => {
      this.defSourcesList.push(...res);
    });
    return {
      logo: "",
      currentVersion: SHOW_VERSION,
      oldDunCount: 0,
      dunInfo: DunInfo,
      settings: Settings,
      currentDataSource: CurrentDataSource,
      defSourcesList: [],
      customTypes: customDataSourceTypes,
      customTypesByName: customDataSourceTypesByName,
      marks: {
        8: "20点",
        12: "第二天凌晨",
        20: "8点",
      },
      activeTab: "0",
      customData: [],
      bodyIsShow: false,
      activeMenu: -1,
      showBack: false,
      menuList: ["body-menu-big-left", "body-menu-big-right"],
      contentList: ["system-form", "view-form"],
    };
  },
  computed: {},
  methods: {
    formatTime: TimeUtil.format,
    openUrl: PlatformHelper.Tabs.create,
    init() {
      this.settings.doAfterInit((settings) => {
        this.customData = settings.customDataSources
          .map((item) => {
            const type = customDataSourceTypesByName[item.type];
            if (type) {
              return {
                type: type.typeName,
                builder: type,
                arg: item.arg,
              };
            }
          })
          .filter((item) => !!item);
        global.customData = this.customData;
        this.logo = "../assets/image/" + settings.logo;
      });
      DunInfo.doAfterUpdate((data) => {
        this.oldDunCount = data.counter;
      });
      CurrentDataSource.doAfterUpdate((data) => {
        this.currentDataSource = data;
      });
    },
    initAnimate() {
      animateCSS(".loading-title-area", "zoomInDown", () => {
        setTimeout(() => {
          animateCSS(".loading-title-area", "zoomOut", () => {
            this.bodyIsShow = true;
            animateCSS(".head-area", "slideInDown");
            animateCSS(".body-area", "fadeInUp");
            document.querySelector(".loading-title-area").style.display =
              "none";
          });
        }, 500);
      });
    },
    addCustomData() {
      this.customData.push({ type: "" });
    },
    handleChangeCustomDataType(index, newType) {
      this.customData[index].builder = customDataSourceTypesByName[newType];
    },
    removeCustomData(index) {
      this.customData.splice(index, 1);
    },
    // 保存设置
    saveSetting(formName, data) {
      if (data) {
        deepAssign(this.settings, data);
      }
      this.settings.customDataSources = this.customData.map((item) => {
        return {
          type: item.type,
          arg: item.arg,
        };
      });
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.settings.saveSettings().then(() => {
            this.$message({
              center: true,
              message: "保存成功",
              type: "success",
            });
          });
        } else {
          return false;
        }
      });
    },
    // 导出设置
    settingExport() {
      const blob = new Blob([JSON.stringify(this.settings)], {
        type: "application/json",
      });
      PlatformHelper.Downloads.downloadURL(
        URL.createObjectURL(blob),
        undefined,
        true
      ).then((data) => {
        console.log(data);
      });
    },
    // 导入设置
    settingImport(file) {
      const reader = new FileReader();
      reader.onload = (res) => {
        const { result } = res.target; // 得到字符串
        const data = JSON.parse(result); // 解析成json对象
        this.$confirm("解析文件成功，是否覆盖当前设置?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.saveSetting("form", data);
          })
          .catch(() => {
            this.$message("你决定了不覆盖当前设置项");
          });
      }; // 成功回调
      reader.onerror = (err) => {
        this.$message.error("没有导入成功，心态崩了啊！");
        this.$notify({
          title: "貌似检测到导出失败",
          message: "可以加QQ群 362860473 后将文件发送给管理员查看检测问题",
          duration: 0,
        });
      }; // 失败回调
      reader.readAsText(new Blob([file.raw]), "utf-8"); // 按照utf-8编码解析
    },
    // 低频时间选择
    lowFrequencyTimeTooltip(val) {
      if (val === 12) {
        return "第二天凌晨";
      } else if (val < 12) {
        return `当天${val + 12}点整`;
      } else if (val > 12) {
        return `第二天${val - 12}点整`;
      }
    },
    changeMenu(className = -1) {
      if (className == -1) {
        this.showBack = false;
        this.menuList.forEach((item) => {
          this.$refs[item].classList.remove("hide");
          this.$refs[item].classList.remove("active");
        });
        this.contentList.forEach((item) => {
          if (this.$refs[item].style.display != "none") {
            animateCSS("." + item, "fadeOutBottomLeft", () => {
              this.$refs[item].style.display = "none";
            });
          }
        });
      } else {
        setTimeout(() => {
          this.showBack = true;
        }, 300);
        this.menuList.forEach((item, index) => {
          if (index == className) {
            this.$refs[item].classList.add("active");
          } else {
            this.$refs[item].classList.add("hide");
          }
        });
        this.contentList.forEach((item, index) => {
          if (index == className) {
            animateCSS("." + item, "fadeInBottomLeft");
            this.$refs[item].style.display = "block";
          } else {
            this.$refs[item].style.display = "none";
          }
        });
      }
    },
    alertFeedback() {
      this.$alert(
        '<span>如果有意见或建议或者是反馈问题或者是发现程序出现bug<br/>可以添加<a href="https://jq.qq.com/?_wv=1027&k=Vod1uO13" target="_blank">【蹲饼组】</a>反馈或<a href="Mailto:kaze.liu@qq.com.com" target="_blank">给我发邮件</a>反馈<br/>更新可以去github上查看<a href="https://github.com/Enraged-Dun-Cookie-Development-Team/Dun-Cookie-Vue" target="_blank">Dun-Cookie-Vue</a><br/>也可以去Chrome，Firefox和Edge应用商店查看更新，但是因为审核机制，更新速度不确定<br/></span>',
        "反馈与更新渠道",
        {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
@ceobeLightColor: #fcddab; //小刻食堂主题亮色浅色
@ceobeVeryLightColor: #fff7ec; //小刻食堂主题非常浅色
@ceobeColor: #ffba4b; //小刻食堂主题亮色
@ceobeDarkColor: #353535; // 小刻食堂主题暗色
#app {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

//loading界面
.loading-title-area {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  user-select: none;

  .loading-title {
    font-size: 2rem;
    margin-top: 50px;
  }

  .loading-image {
    width: 200px;
  }
}

//顶部区域
.head-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: @ceobeColor;
  color: #fff;
  height: 100px;
  padding: 0 20px;
  // 头部左侧logo和版本信息
  .head {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    .img {
      width: 80px;
    }

    .name-area {
      display: flex;
      flex-direction: column;
      margin-left: 20px;

      .name {
        font-size: 1.6rem;
      }

      .version {
        margin-top: 5px;
        font-size: 1.2rem;
      }
    }
  }

  // 头部右侧蹲饼信息和时间
  .info {
    text-align: center;
    color: #ffffff;
    position: relative;

    .info-title {
      font-size: 1.3rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      user-select: none;

      &:hover + .more-cookie {
        opacity: 1;
      }

      .has-cookie {
        font-size: 1.6rem;
      }

      .look-cookie {
        margin-top: 5px;
        font-size: 1.2rem;
      }
    }

    .more-cookie {
      border-radius: 3px;
      position: absolute;
      right: -10px;
      background: @ceobeColor;
      color: #ffffff;
      top: 90px;
      text-align: right;
      font-size: 0.95rem;
      padding: 10px;
      opacity: 0;
      transition: all 0.5s;
      z-index: 999;

      .info-time {
        margin-top: 10px;
      }
    }
  }
}

// 下部分区域
.body-area {
  .body-menu-big {
    height: calc(100vh - 100px);
    position: relative;

    //左右菜单样式
    .body-menu-big-left,
    .body-menu-big-right {
      position: absolute;
      left: calc(25vw - 150px);
      top: calc(50vh - 100px - 150px);
      width: 300px;
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      transition: 1s all;

      &.active {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;

        .menu-card {
          border: 2px solid #fff;

          span:first-child,
          span:last-child {
            font-size: 3rem;
            bottom: 10px;
          }

          span:last-child {
            left: 123px;
          }

          &.system:after,
          &.view:after {
            font-size: 4rem;
            right: 6px;
            top: 6px;
          }
        }
      }

      &.hide {
        width: 0;
        height: 0;
        opacity: 0;
        z-index: -1;
      }

      .menu-card {
        width: 100%;
        height: 100%;
        cursor: pointer;
        border-radius: 3px;
        border: 2px solid #cccccc;
        display: flex;
        flex-direction: column;
        user-select: none;
        position: relative;
        overflow: hidden;
        transition: all 1s;
        box-sizing: border-box;

        &.system:after,
        &.view:after {
          font-family: element-icons !important;
          content: "\e6ca";
          font-size: 15rem;
          position: absolute;
          right: -40px;
          top: -70px;
          opacity: 0.2;
          z-index: 0;
          transition: all 1s;
        }

        &.view:after {
          content: "\e775";
        }

        span:first-child,
        span:last-child {
          font-size: 5.5rem;
          color: #fff;
          font-family: "SimHei", -apple-system, BlinkMacSystemFont,
            "Microsoft YaHei", "Segoe UI", "Roboto", "Helvetica Neue", Arial,
            sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          text-shadow: 0 0 1rem #312f2f, 0 0 0.5rem #312f2f, 0 0 0.25rem #312f2f;
          position: absolute;
          bottom: 90px;
          left: 25px;
          z-index: 2;
          transition: all 1s;
        }

        span:last-child {
          font-size: 4rem;
          left: 95px;
          bottom: 20px;
          z-index: 1;
        }
      }
    }

    .body-menu-big-right {
      left: calc(75vw - 150px);
      top: calc(50vh - 100px - 150px);
    }
  }

  // 返回按钮样式
  .back-btn {
    font-size: 2.5rem;
    position: absolute;
    left: 20px;
    top: 130px;
    opacity: 1;
    transition: all 0.7s;

    &.btn-hide {
      opacity: 0;
      pointer-events: none;
    }
  }

  .config-btn,
  .feedback-btn {
    position: absolute;
    right: 30px;
    bottom: 10px;
    opacity: 1;
    transition: all 0.7s;

    &.btn-hide {
      opacity: 0;
      pointer-events: none;
    }

    div {
      display: inline;
    }

    button {
      width: 240px;
      height: 60px;
      margin: auto 3px;
      padding: 5px 10px;
      cursor: pointer;

      font-size: 1.6em;
      letter-spacing: 1px;
      color: #222;
      border-radius: 0;

      position: relative;

      &.purple {
        background: #d67ada;
      }

      &.green {
        background: #e2d84d;
      }

      &.pink {
        background: #febbbb;
      }

      &:after {
        content: "";
        background: linear-gradient(
          to right,
          #222 0%,
          #222 50%,
          #fff 50%,
          #fff 100%
        );
        background-position: 100% 0;
        background-size: 200% 100%;
        width: 100%;
        height: 5px;
        position: absolute;
        top: 100%;
        left: 0;
        transition: all 0.5s;
      }

      &:hover {
        &:after {
          background-position: 0 0;
        }
      }

      &:active {
        font-size: 1.8em;
      }
    }
  }

  // 内容样式
  .body-menu-content {
    position: absolute;
    top: 150px;
    left: 10vw;
    width: 80vw;
    height: calc(100vh - 250px);
    overflow: auto;

    // 卡片列表间隔及其第一个和最后一个的间距
    .body-menu-content-card {
      margin: 20px 0;

      &:first-child {
        margin-top: 0;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    //卡片
    .body-menu-content-card,
    .body-menu-content-line {
      position: relative;

      //卡片标题
      .content-card-title,
      .content-line-title {
        position: absolute;
        top: -9px;
        font-size: 1rem;
        background: #fff;
        left: 20px;
        padding: 0 10px;
        color: #222;
      }

      //描述标题
      .content-card-description,
      .content-line-description {
        position: absolute;
        top: -9px;
        right: 20px;
        padding: 0 10px;
        font-size: 0.8rem;
        color: #9e9e9e;
        background: #fff;
      }

      //卡片内容
      .content-card-content,
      .content-line-content {
        border-radius: 3px;
        border: 1px solid @ceobeColor;
        padding: 20px;
        margin: 10px 0;
        color: @ceobeColor;

        &.flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .text-right {
          text-align: right;
        }

        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .el-form-item {
          margin-bottom: 0;
        }
      }
    }

    //卡片内画线样式
    .body-menu-content-line {
      margin-top: 20px;

      .content-line-content {
        border-bottom: none;
        border-left: none;
        border-right: none;
        border-radius: 0;
      }

      &:last-child {
        .content-line-content {
          padding-bottom: 0;
        }
      }
    }
  }

  //表单
  .form {
    .system,
    .view {
      display: none;
    }

    .flex {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .body-menu-content-card {
        width: 48%;
        margin-bottom: 0px;
        margin-top: 10px;

        .content-card-content {
          margin: 0;
        }
      }
    }

    .btn-area {
      width: 100%;
      text-align: center;
      margin-top: 10px;
    }

    .checkbox-group-area {
      display: flex;
      flex-wrap: wrap;

      .el-checkbox {
        display: flex;
        align-items: center;
        margin-top: 5px;

        .checkbox-area {
          display: flex;
          align-items: center;

          .icon-img {
            margin-right: 5px;
            width: 16px;
          }
        }
      }
    }
  }
}

//正常运行中动画
.info-animate {
  border-radius: 3px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #312f2f;
  color: #fff;
  padding: 16px 30px;
  font-size: 1.6rem;
  width: 300px;

  .animate {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-weight: bold;

    &::after {
      position: absolute;
      left: -5px;
      top: -2px;
      width: 40px;
      height: 40px;
      content: " ";
      background: url("/assets/image/animate.png");
      background-size: contain;
      animation: rotate infinite 6s ease-out;
    }
  }

  .animate-text-area {
    width: 80%;
    overflow: hidden;
    margin-left: 20px;
    font-size: 18px;
    color: #7d7d7c;
    user-select: none;

    .animate-text {
      display: flex;
      animation: text-marquee 5s infinite linear;

      div {
        white-space: nowrap;

        &:not(:first-child) {
          margin-left: 80px;
        }
      }
    }
  }
}

// 开关按钮
/deep/ .el-switch.is-checked .el-switch__core {
  border-color: @ceobeColor;
  background-color: @ceobeColor;
}

// 单选框
/deep/ .el-radio__input.is-checked .el-radio__inner {
  border-color: @ceobeColor;
  background: @ceobeColor;
}
/deep/ .el-radio__inner:hover {
  border-color: @ceobeColor;
}
/deep/ .el-radio__input.is-checked + .el-radio__label {
  color: @ceobeColor;
}

// 多选框
/deep/ .el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: @ceobeColor;
  border-color: @ceobeColor;
}
/deep/ .el-checkbox__inner:hover {
  border-color: @ceobeColor;
}
/deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
  border-color: @ceobeColor;
}
/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
  color: @ceobeColor;
}

// 拖拉条
/deep/ .el-slider__bar {
  background-color: @ceobeColor;
}
/deep/ .el-slider__button {
  border-color: @ceobeColor;
}

// 计数器
/deep/ .el-input.is-active .el-input__inner,
/deep/ .el-input__inner:focus {
  border-color: @ceobeColor;
}
/deep/
  .el-input-number__decrease:hover:not(.is-disabled)
  ~ .el-input
  .el-input__inner:not(.is-disabled),
/deep/
  .el-input-number__increase:hover:not(.is-disabled)
  ~ .el-input
  .el-input__inner:not(.is-disabled) {
  border-color: @ceobeColor;
}

// 按钮
.el-button:focus,
.el-button:hover {
  color: @ceobeColor;
  border-color: @ceobeLightColor;
  background-color: @ceobeVeryLightColor;
}

.body-menu-content {
  scrollbar-width: none;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

@keyframes text-marquee {
  from {
    margin-left: 0;
  }
  to {
    margin-left: -242px;
  }
}
</style>
