# 跨域资源共享 CORS 详解

<article class="hentry">                                                               
<div class="asset-content entry-content" id="main-content">
<p>CORS是一个W3C标准，全称是"跨域资源共享"（Cross-origin resource sharing）。</p>

<p>它允许浏览器向跨源服务器，发出<a href="http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html" target="_blank"><code>XMLHttpRequest</code></a>请求，从而克服了AJAX只能<a href="http://www.ruanyifeng.com/blog/2016/04/same-origin-policy.html" target="_blank">同源</a>使用的限制。</p>

<p>本文详细介绍CORS的内部机制。</p>

<h2>一、简介</h2>

<p>CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。</p>

<p>整个CORS通信过程，都是浏览器自动完成，不需要用户参与。对于开发者来说，CORS通信与同源的AJAX通信没有差别，代码完全一样。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。</p>

<p>因此，实现CORS通信的关键是服务器。只要服务器实现了CORS接口，就可以跨源通信。</p>

<h2>二、两种请求</h2>

<p>浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。</p>

<p>只要同时满足以下两大条件，就属于简单请求。</p>

<blockquote>
  <p>（1) 请求方法是以下三种方法之一：</p>

<ul>
<li>HEAD</li>
<li>GET</li>
<li>POST</li>
</ul>

<p>（2）HTTP的头信息不超出以下几种字段：</p>

<ul>
<li>Accept</li>
<li>Accept-Language</li>
<li>Content-Language</li>
<li>Last-Event-ID</li>
<li>Content-Type：只限于三个值<code>application/x-www-form-urlencoded</code>、<code>multipart/form-data</code>、<code>text/plain</code></li>
</ul>
</blockquote>

<p>凡是不同时满足上面两个条件，就属于非简单请求。</p>

<p>浏览器对这两种请求的处理，是不一样的。</p>

<h2>三、简单请求</h2>

<h3>3.1 基本流程</h3>

<p>对于简单请求，浏览器直接发出CORS请求。具体来说，就是在头信息之中，增加一个<code>Origin</code>字段。</p>

<p>下面是一个例子，浏览器发现这次跨源AJAX请求是简单请求，就自动在头信息之中，添加一个<code>Origin</code>字段。</p>

```js
Origin: http://api.bob.com
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

<p>上面的头信息中，<code>Origin</code>字段用来说明，本次请求来自哪个源（协议 + 域名 + 端口）。服务器根据这个值，决定是否同意这次请求。</p>

<p>如果<code>Origin</code>指定的源，不在许可范围内，服务器会返回一个正常的HTTP回应。浏览器发现，这个回应的头信息没有包含<code>Access-Control-Allow-Origin</code>字段（详见下文），就知道出错了，从而抛出一个错误，被<code>XMLHttpRequest</code>的<code>onerror</code>回调函数捕获。注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。</p>

<p>如果<code>Origin</code>指定的域名在许可范围内，服务器返回的响应，会多出几个头信息字段。</p>

```js
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
Content-Type: text/html; charset=utf-8
```

<p>上面的头信息之中，有三个与CORS请求相关的字段，都以<code>Access-Control-</code>开头。</p>

<p><strong>（1）Access-Control-Allow-Origin</strong></p>

<p>该字段是必须的。它的值要么是请求时<code>Origin</code>字段的值，要么是一个<code>*</code>，表示接受任意域名的请求。</p>

<p><strong>（2）Access-Control-Allow-Credentials</strong></p>

<p>该字段可选。它的值是一个布尔值，表示是否允许发送Cookie。默认情况下，Cookie不包括在CORS请求之中。设为<code>true</code>，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为<code>true</code>，如果服务器不要浏览器发送Cookie，删除该字段即可。</p>

<p><strong>（3）Access-Control-Expose-Headers</strong></p>

<p>该字段可选。CORS请求时，<code>XMLHttpRequest</code>对象的<code>getResponseHeader()</code>方法只能拿到6个基本字段：<code>Cache-Control</code>、<code>Content-Language</code>、<code>Content-Type</code>、<code>Expires</code>、<code>Last-Modified</code>、<code>Pragma</code>。如果想拿到其他字段，就必须在<code>Access-Control-Expose-Headers</code>里面指定。上面的例子指定，<code>getResponseHeader('FooBar')</code>可以返回<code>FooBar</code>字段的值。</p>

<h3>3.2 withCredentials 属性</h3>

<p>上面说到，CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定<code>Access-Control-Allow-Credentials</code>字段。</p>

```js
Access-Control-Allow-Credentials: true
```

<p>另一方面，开发者必须在AJAX请求中打开<code>withCredentials</code>属性。</p>

```js
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

<p>否则，即使服务器同意发送Cookie，浏览器也不会发送。或者，服务器要求设置Cookie，浏览器也不会处理。</p>

<p>但是，如果省略<code>withCredentials</code>设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭<code>withCredentials</code>。</p>

```js
xhr.withCredentials = false;
```
<p>需要注意的是，如果要发送Cookie，<code>Access-Control-Allow-Origin</code>就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的<code>document.cookie</code>也无法读取服务器域名下的Cookie。</p>

<h2>四、非简单请求</h2>

<h3>4.1 预检请求</h3>

<p>非简单请求是那种对服务器有特殊要求的请求，比如请求方法是<code>PUT</code>或<code>DELETE</code>，或者<code>Content-Type</code>字段的类型是<code>application/json</code>。</p>

<p>非简单请求的CORS请求，会在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。</p>

<p>浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的<code>XMLHttpRequest</code>请求，否则就报错。</p>

<p>下面是一段浏览器的JavaScript脚本。</p>

```js
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

<p>上面代码中，HTTP请求的方法是<code>PUT</code>，并且发送一个自定义头信息<code>X-Custom-Header</code>。</p>

<p>浏览器发现，这是一个非简单请求，就自动发出一个"预检"请求，要求服务器确认可以这样请求。下面是这个"预检"请求的HTTP头信息。</p>

```js
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: 
```

<p>"预检"请求用的请求方法是<code>OPTIONS</code>，表示这个请求是用来询问的。头信息里面，关键字段是<code>Origin</code>，表示请求来自哪个源。</p>

<p>除了<code>Origin</code>字段，"预检"请求的头信息包括两个特殊字段。</p>

<p><strong>（1）Access-Control-Request-Method</strong></p>

<p>该字段是必须的，用来列出浏览器的CORS请求会用到哪些HTTP方法，上例是<code>PUT</code>。</p>

<p><strong>（2）Access-Control-Request-Headers</strong></p>

<p>该字段是一个逗号分隔的字符串，指定浏览器CORS请求会额外发送的头信息字段，上例是<code>X-Custom-Header</code>。</p>

<h3>4.2 预检请求的回应</h3>

<p>服务器收到"预检"请求以后，检查了<code>Origin</code>、<code>Access-Control-Request-Method</code>和<code>Access-Control-Request-Headers</code>字段以后，确认允许跨源请求，就可以做出回应。</p>

```js
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

<p>上面的HTTP回应中，关键的是<code>Access-Control-Allow-Origin</code>字段，表示<code>http://api.bob.com</code>可以请求数据。该字段也可以设为星号，表示同意任意跨源请求。</p>

`Access-Control-Allow-Origin: *`

<p>如果浏览器否定了"预检"请求，会返回一个正常的HTTP回应，但是没有任何CORS相关的头信息字段。这时，浏览器就会认定，服务器不同意预检请求，因此触发一个错误，被<code>XMLHttpRequest</code>对象的<code>onerror</code>回调函数捕获。控制台会打印出如下的报错信息。</p>

```js
XMLHttpRequest cannot load http://api.alice.com.
Origin http://api.bob.com is not allowed by Access-Control-Allow-Origin.
```

<p>服务器回应的其他CORS相关字段如下。</p>

```js
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

<p><strong>（1）Access-Control-Allow-Methods</strong></p>

<p>该字段必需，它的值是逗号分隔的一个字符串，表明服务器支持的所有跨域请求的方法。注意，返回的是所有支持的方法，而不单是浏览器请求的那个方法。这是为了避免多次"预检"请求。</p>

<p><strong>（2）Access-Control-Allow-Headers</strong></p>

<p>如果浏览器请求包括<code>Access-Control-Request-Headers</code>字段，则<code>Access-Control-Allow-Headers</code>字段是必需的。它也是一个逗号分隔的字符串，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。</p>

<p><strong>（3）Access-Control-Allow-Credentials</strong></p>

<p>该字段与简单请求时的含义相同。</p>

<p><strong>（4）Access-Control-Max-Age</strong></p>

<p>该字段可选，用来指定本次预检请求的有效期，单位为秒。上面结果中，有效期是20天（1728000秒），即允许缓存该条回应1728000秒（即20天），在此期间，不用发出另一条预检请求。</p>

<h3>4.3 浏览器的正常请求和回应</h3>

<p>一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样，会有一个<code>Origin</code>头信息字段。服务器的回应，也都会有一个<code>Access-Control-Allow-Origin</code>头信息字段。</p>

<p>下面是"预检"请求之后，浏览器的正常CORS请求。</p>

```js
PUT /cors HTTP/1.1
Origin: http://api.bob.com
Host: api.alice.com
X-Custom-Header: value
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```
<p>上面头信息的<code>Origin</code>字段是浏览器自动添加的。</p>

<p>下面是服务器正常的回应。</p>

```js
Access-Control-Allow-Origin: http://api.bob.com
Content-Type: text/html; charset=utf-8
```

<p>上面头信息中，<code>Access-Control-Allow-Origin</code>字段是每次回应都必定包含的。</p>

<h2>五、与JSONP的比较</h2>

<p>CORS与JSONP的使用目的相同，但是比JSONP更强大。</p>

<p>JSONP只支持<code>GET</code>请求，CORS支持所有类型的HTTP请求。JSONP的优势在于支持老式浏览器，以及可以向不支持CORS的网站请求数据。</p>

<p>（完）</p>

</ul>
</div>
</article>

[原文地址](http://www.ruanyifeng.com/blog/2016/04/cors.html)