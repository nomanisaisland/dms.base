/*
 * @Author: lujiafeng
 * @Date: 2022-07-21 01:24:12
 * @LastEditTime: 2022-07-21 01:34:47
 * @LastEditors: lujiafeng
 * @Description: 
 * @FilePath: \myWebsite\base\types\comp\Image.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { CompAttrWH, CompAttr } from "./common"

export interface CompImage extends CompAttrWH, CompAttr {

  // 图像的 URL，这个属性对 <img> 元素来说是必需的。在支持 srcset 的浏览器中，src 被当做拥有一个像素密度的描述符 1x 的候选图像处理，除非一个图像拥有这个像素密度描述符已经被在 srcset 或者 srcset 包含 w 描述符中定义了。
  src: string;

  // 属性包含一条对图像的文本描述，这不是强制性的，但对可访问性而言，它难以置信地有用——屏幕阅读器会将这些描述读给需要使用阅读器的使用者听，让他们知道图像的含义。如果由于某种原因无法加载图像，普通浏览器也会在页面上显示alt 属性中的备用文本：例如，网络错误、内容被屏蔽或链接过期时。
  alt?: string;

  // 鼠标悬停提示，不要和alt一样，不然障碍浏览器可能会读两遍
  title?: string;

  // TODO这个属性还需要再测试了解一下
  // 这个属性让跨域的图片可以获取到，canvas如果拿不到图片可以先用这个拿到后再添加到canvas画布中
  // Anonymous
  // use-credentials
  crossorigin?: string;

  // 为浏览器提供图像解码方式上的提示。允许的值：
  // sync 同步解码图像，实现与其他内容的显示相互斥的原子显示。
  // async 异步解码图像，以减少其他内容的显示延迟。
  // auto 默认值：不指定解码方式，由浏览器决定哪一种对用户来说是最合适的。
  decoding?: string;

  // 指示下载资源时相对重要性，或者说优先级。允许的值：
  // auto 不指定优先级。浏览器可以使用自己的算法来为图像选择优先级。
  // high 此图像在下载时优先级较高。
  // low 此图像在下载时优先级较低。
  importance?: string;

  // 该属性告诉浏览器忽略图像的实际固有大小，并假设它是属性中指定的大小。具体来说，图像将以这些维度进行光栅化，图像上的自然宽度/自然高度将返回此属性中指定的值。
  intrinsicsize?: string;

  // 这个布尔属性表示图像是否是服务器端 map 的一部分。如果是，那么点击图片的精准坐标将会被发送到服务器。
  // 使用说明：只有在 <img> 元素是一个拥有有效 href 属性的 <a> 元素的后代元素的情况下，这个属性才会被允许使用。
  ismap?: boolean;

  // 指示浏览器应当如何加载该图像。允许的值：
  // eager 立即加载图像，不管它是否在可视视口（visible viewport）之外（默认值）。
  // lazy 延迟加载图像，直到它和视口接近到一个计算得到的距离，由浏览器定义。
  loading?: string;

  // 一个字符串，指示在获取资源时要使用哪个引用：(实验中)
  // no-referrer: The Referer header will not be sent.
  // no-referrer-when-downgrade: No Referer header is sent when navigating to an origin without HTTPS. This is the default if no policy is otherwise specified.
  // origin: The Referer header will include the page's origin (scheme, host, and port (en-US)).
  // origin-when-cross-origin: Navigating to other origins will limit the included referral data to the scheme, host, and port, while navigating from the same origin will include the full path and query string.
  // unsafe-url: The Referer header will always include the origin, path and query string, but not the fragment, password, or username. This is unsafe because it can leak information from TLS-protected resources to insecure origins.
  referrerpolicy?: string;

  // 表示资源大小的、以逗号隔开的一个或多个字符串。每一个资源大小包括：
  // 一个媒体条件。最后一项一定是被忽略的。
  // 一个资源尺寸的值。
  // Media Conditions describe properties of the viewport, not of the image. For example, (max-height: 500px) 1000px proposes to use a source of 1000px width, if the viewport is not higher than 500px.
  // 资源尺寸的值被用来指定图像的预期尺寸。当 srcset 中的资源使用了宽度描述符 w 时，用户代理会使用当前图像大小来选择 srcset 中合适的一个图像 URL。被选中的尺寸影响图像的显示大小（如果没有影响大小的 CSS 样式被应用的话）。如果没有设置 srcset 属性，或者没有属性值，那么 sizes 属性也将不起作用。
  sizes?: string;

  // 以逗号分隔的一个或多个字符串列表表明一系列用户代理使用的可能的图像。每一个字符串由以下组成：
  //    指向图像的 URL。
  //    可选地，再加一个空格之后，附加以下的其一：
  //        一个宽度描述符，这是一个正整数，后面紧跟 'w' 符号。该整数宽度除以 sizes 属性给出的资源（source）大小来计算得到有效的像素密度，即换算成和 x 描述符等价的值。
  //        一个像素密度描述符，这是一个正浮点数，后面紧跟 'x' 符号。
  // 如果没有指定源描述符，那它会被指定为默认的 1x。
  // 在相同的 srcset 属性中混合使用宽度描述符和像素密度描述符时，会导致该值无效。重复的描述符（比如，两个源在相同的 srcset 两个源都是 2x）也是无效的。
  /**
   * 这个例子引用了 MDN 标志高清版本；在高分辨率设备上，它将被优先加载，取代 src 属性中的图像。在支持 srcset 的用户代理中，src 属性中的图片被作为 1x 候选项。
   *  <img src="favicon72.png"
      alt="MDN logo"
      srcset="favicon144.png 2x">

      在支持 srcset 的用户代理中，当使用 w 描述符时，src 属性会被忽略。当匹配了媒体条件 (max-width: 600px) 时，图像将宽 200px，否则宽 50vw（视图宽度的 50%）。
      <img src="clock-demo-200px.png"
      alt="Clock"
      srcset="clock-demo-200px.png 200w,
          clock-demo-400px.png 400w"
      sizes="(max-width: 600px) 200px, 50vw">
  */
  srcset?: string;

  // 与元素相关联的 image map (en-US) 的部分 URL（以 '#' 开始的部分）。
  // 使用说明： 如果 <img> 元素是 <a> 或 <button> 元素的后代元素则不能使用这个属性。
  usemap?: string;
}