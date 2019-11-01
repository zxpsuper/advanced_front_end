(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{177:function(_,t,v){"use strict";v.r(t);var e=v(0),s=Object(e.a)({},function(){var _=this,t=_.$createElement,v=_._self._c||t;return v("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[v("h1",{attrs:{id:"前端网络安全"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#前端网络安全","aria-hidden":"true"}},[_._v("#")]),_._v(" 前端网络安全")]),_._v(" "),v("h2",{attrs:{id:"_1-xss-跨站脚本攻击"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-xss-跨站脚本攻击","aria-hidden":"true"}},[_._v("#")]),_._v(" 1. XSS 跨站脚本攻击")]),_._v(" "),v("p",[v("strong",[_._v("原理")])]),_._v(" "),v("blockquote",[v("p",[_._v("XSS 是常见的 Web 攻击技术之一.所谓的跨站脚本攻击指得是:恶意攻击者往 Web 页面里注入恶意 Script 代码，用户浏览这些网页时，就会执行其中的恶意代码，可对用户进行盗取 cookie 信息、会话劫持等各种攻击。")])]),_._v(" "),v("p",[v("strong",[_._v("危害")])]),_._v(" "),v("p",[_._v("1、盗取各类用户帐号，如机器登录帐号、用户网银帐号、各类管理员帐号")]),_._v(" "),v("p",[_._v("2、控制企业数据，包括读取、篡改、添加、删除企业敏感数据的能力")]),_._v(" "),v("p",[_._v("3、盗窃企业重要的具有商业价值的资料")]),_._v(" "),v("p",[_._v("4、非法转账")]),_._v(" "),v("p",[_._v("5、强制发送电子邮件")]),_._v(" "),v("p",[_._v("6、网站挂马")]),_._v(" "),v("p",[_._v("7、控制受害者机器向其它网站发起攻击")]),_._v(" "),v("p",[v("strong",[_._v("前端如何处理")])]),_._v(" "),v("ul",[v("li",[v("p",[_._v('过滤用户的输入信息，禁止用户在输入的过程中输入 "<", ">", "引号", "$", "_"')])]),_._v(" "),v("li",[v("p",[_._v("核心的用户身份标示或 token 保存在 Cookie 中,Cookie 中一定要加 “HTTPOnly” 在结尾，保证只有在 html 操作时才能将 cookie 中的内容发送出去，在 JS 中无法获得用户的 Cookie 信息")])])]),_._v(" "),v("h2",{attrs:{id:"_2-csrf-网络攻击"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-csrf-网络攻击","aria-hidden":"true"}},[_._v("#")]),_._v(" 2. CSRF 网络攻击")]),_._v(" "),v("p",[v("strong",[_._v("原理")])]),_._v(" "),v("blockquote",[v("p",[_._v("CSRF（Cross-site request forgery）跨站请求伪造，也被称为 “One Click Attack” 或者 Session Riding，通常缩写为 CSRF 或者 XSRF，是一种对网站的恶意利用。尽管听起来像跨站脚本（XSS），但它与 XSS 非常不同，XSS 利用站点内的信任用户，而 CSRF 则通过伪装来自受信任用户的请求来利用受信任的网站。与 XSS 攻击相比，CSRF 攻击往往不大流行（因此对其进行防范的资源也相当稀少）和难以防范，所以被认为比 XSS 更具危险性。")])]),_._v(" "),v("p",[v("strong",[_._v("前端如何处理")])]),_._v(" "),v("ul",[v("li",[_._v("减少在 cookie 中存储客户核心内容比如用户的 token、ID、access_token 等")]),_._v(" "),v("li",[_._v("GET 请求不对数据进行修改")]),_._v(" "),v("li",[_._v("不让第三方网站访问到 Cookie")]),_._v(" "),v("li",[_._v("阻止第三方网站请求接口")]),_._v(" "),v("li",[_._v("请求时附带验证信息，比如验证码或者 Token")])]),_._v(" "),v("h2",{attrs:{id:"_3-ddos-攻击"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-ddos-攻击","aria-hidden":"true"}},[_._v("#")]),_._v(" 3. DDOS 攻击")]),_._v(" "),v("p",[v("strong",[_._v("原理")])]),_._v(" "),v("blockquote",[v("p",[_._v("DDOS 攻击，它在短时间内发起大量请求，耗尽服务器的资源，无法响应正常的访问，造成网站实质下线。")])]),_._v(" "),v("p",[v("strong",[_._v("前端如何处理")])]),_._v(" "),v("ul",[v("li",[_._v("防范 DDOS 的第一步，就是你要有一个备份网站，或者最低限度有一个临时主页。生产服务器万一下线了，可以立刻切换到备份网站，不至于毫无办法。")])]),_._v(" "),v("p",[v("strong",[_._v("后端如何处理")])]),_._v(" "),v("ul",[v("li",[v("p",[_._v("HTTP 请求的拦截，恶意请求都是从某个 IP 段发出的，那么把这个 IP 段封掉就行了。或者，它们的 User Agent 字段有特征（包含某个特定的词语），那就把带有这个词语的请求拦截。")])]),_._v(" "),v("li",[v("p",[_._v("带宽扩容，或者使用 CDN")])])]),_._v(" "),v("comment")],1)},[],!1,null,null,null);t.default=s.exports}}]);