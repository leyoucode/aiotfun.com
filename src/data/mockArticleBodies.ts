/** 文章 HTML 正文数据，以 slug 为 key */

const articleBodiesEn: Record<string, string> = {
  'esp32-voice-commands': `
<h2>Why Local Voice Recognition Matters</h2>
<p>For years, voice-controlled IoT devices have relied on cloud services — send audio to a server, wait for processing, get a response. It works, but it's slow, privacy-invasive, and falls apart without internet. This project changes that.</p>
<p>Built by a community of open-source enthusiasts, this ESP32-based system runs a quantized language model entirely on-device. The result? Real-time voice command recognition with zero cloud dependency.</p>

<h2>The Hardware Setup</h2>
<p>The build is surprisingly accessible:</p>
<ul>
  <li><strong>ESP32-S3</strong> with 8MB PSRAM — the brain of the operation</li>
  <li><strong>INMP441</strong> I2S MEMS microphone — captures audio at 16kHz</li>
  <li><strong>MAX98357A</strong> I2S amplifier + speaker — for audio feedback</li>
  <li>Total cost: under $15 in components</li>
</ul>

<h2>How the Model Works</h2>
<p>The team used a heavily quantized version of a small transformer model (just 2M parameters) trained specifically on command phrases. The model runs inference in under 200ms on the ESP32-S3's dual-core processor.</p>
<pre><code>// Example: Registering a voice command
voice_cmd_register("turn on lights", [](void) {
    gpio_set_level(RELAY_PIN, HIGH);
    audio_play("lights_on.wav");
});

voice_cmd_register("set timer", [](void) {
    start_timer(DEFAULT_DURATION);
    audio_play("timer_started.wav");
});</code></pre>

<h2>Real-World Performance</h2>
<p>We tested it in a typical living room environment with background noise from a TV. The recognition accuracy was impressive:</p>
<ul>
  <li>Quiet environment: <strong>94% accuracy</strong></li>
  <li>Moderate background noise: <strong>87% accuracy</strong></li>
  <li>Loud environment: <strong>71% accuracy</strong></li>
</ul>
<p>Not perfect, but remarkably good for a $15 device running everything locally.</p>

<blockquote>
  <p>"The fact that this runs entirely on an ESP32 with no cloud whatsoever is mind-blowing. This is what edge AI should look like." — Community contributor</p>
</blockquote>

<h2>What's Next</h2>
<p>The project roadmap includes wake-word detection, multi-language support, and a web-based training interface for custom commands. The GitHub repo already has over 2,000 stars and growing.</p>
`,

  'jetson-orin-nano-review': `
<h2>The Jetson Lineup Gets Affordable</h2>
<p>NVIDIA has been the king of GPU-accelerated edge computing for a while, but the Jetson lineup has always had a price problem. The original Orin Nano started at $499 — great for industrial applications, but too expensive for hobbyists and students. The new revision changes everything.</p>

<h2>Specs at a Glance</h2>
<ul>
  <li><strong>GPU:</strong> 1024 CUDA cores + 32 Tensor cores</li>
  <li><strong>CPU:</strong> 6-core Arm Cortex-A78AE</li>
  <li><strong>AI Performance:</strong> Up to 67 TOPS (INT8)</li>
  <li><strong>Memory:</strong> 8GB LPDDR5 with 102 GB/s bandwidth</li>
  <li><strong>Storage:</strong> M.2 NVMe slot</li>
  <li><strong>Price:</strong> $249 (developer kit)</li>
</ul>

<h2>Benchmark Results</h2>
<p>We ran our standard edge AI benchmark suite across several popular models:</p>
<figure>
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop" alt="Benchmark setup" />
  <figcaption>Our benchmark test setup with the Jetson Orin Nano developer kit</figcaption>
</figure>
<p>The highlights: YOLOv8n runs at <strong>145 FPS</strong> at 640×640 resolution. Whisper-tiny transcribes at <strong>12x real-time</strong>. Stable Diffusion generates a 512×512 image in <strong>8 seconds</strong>. These numbers put it firmly in the "capable workstation" category for edge AI development.</p>

<h2>Who Should Buy This?</h2>
<p>If you're building anything that needs serious on-device AI — robotics, smart cameras, local LLM inference, real-time object detection — the new Orin Nano is the sweet spot of price and performance. It's not the cheapest board out there, but it's the most capable one under $300 by a wide margin.</p>
`,

  'smart-camera-fire-detection': `
<h2>Prevention Over Detection</h2>
<p>Most smart home cameras alert you after something has already happened — a break-in, a package theft, a fire. SafeSense, a new startup out of Berlin, is flipping the script with a camera that uses on-device ML to detect <em>precursors</em> to dangerous events.</p>

<h2>How It Works</h2>
<p>The camera uses a custom vision model trained on thousands of hours of footage showing early signs of household hazards:</p>
<ul>
  <li><strong>Smoke detection:</strong> Identifies wisps of smoke before a fire alarm would trigger</li>
  <li><strong>Water leak detection:</strong> Spots pooling water on floors using reflection analysis</li>
  <li><strong>Gas stove monitoring:</strong> Tracks flame status and alerts if left unattended</li>
  <li><strong>Electrical hazard:</strong> Detects sparking or overheating outlets via thermal patterns</li>
</ul>
<p>All processing happens on a dedicated edge AI chip inside the camera. No footage leaves your home unless you explicitly choose to upload it.</p>

<blockquote>
  <p>"We believe privacy and safety shouldn't be a trade-off. Everything runs locally." — SafeSense CEO</p>
</blockquote>

<h2>Pricing and Availability</h2>
<p>The SafeSense camera is priced at $129 with no subscription required. Pre-orders open in March 2026, with shipping expected in Q2.</p>
`,

  'llama-raspberry-pi': `
<h2>The Promise of Local LLMs</h2>
<p>Running a large language model on a Raspberry Pi sounds like a party trick — fun to demo, but not really usable. With the Pi 5's improved specs and the latest quantization techniques, we wanted to see if that's still true in 2026.</p>

<h2>Test Setup</h2>
<p>We tested three quantized versions of Llama 2 on a Raspberry Pi 5 (8GB RAM):</p>
<ul>
  <li><strong>Llama 2 7B Q4_K_M</strong> — 4-bit quantized, 4.1GB</li>
  <li><strong>Llama 2 7B Q2_K</strong> — 2-bit quantized, 2.7GB</li>
  <li><strong>TinyLlama 1.1B Q8_0</strong> — 8-bit quantized, 1.1GB</li>
</ul>

<h2>Results</h2>
<pre><code>Model               | Tokens/sec | RAM Usage | Quality
--------------------|------------|-----------|--------
Llama 2 7B Q4_K_M   | 2.8 t/s    | 5.2GB     | Good
Llama 2 7B Q2_K     | 4.1 t/s    | 3.6GB     | Fair
TinyLlama 1.1B Q8_0 | 11.3 t/s   | 1.8GB     | Decent</code></pre>

<h2>The Verdict</h2>
<p>Is it usable? <strong>It depends.</strong> For interactive chat, even 4 tokens/second feels painfully slow. But for batch processing tasks — summarizing text, classifying inputs, generating structured data — it's surprisingly practical. TinyLlama at 11 tokens/second is genuinely usable for simple tasks.</p>
<p>The Pi 5 isn't replacing your GPU server anytime soon, but edge LLM inference has gone from "impossible" to "surprisingly workable" in just two years.</p>
`,
};

const articleBodiesZh: Record<string, string> = {
  'esp32-voice-commands': `
<h2>为什么本地语音识别很重要</h2>
<p>多年来，语音控制的物联网设备一直依赖云服务——将音频发送到服务器，等待处理，获取响应。这种方式可以工作，但速度慢、侵犯隐私，而且没有网络就彻底瘫痪。这个项目改变了这一切。</p>
<p>由一群开源爱好者打造的这个基于 ESP32 的系统，完全在设备端运行量化语言模型。结果？零云依赖的实时语音命令识别。</p>

<h2>硬件配置</h2>
<p>这个项目的硬件清单出奇地亲民：</p>
<ul>
  <li><strong>ESP32-S3</strong> 配备 8MB PSRAM——整个系统的大脑</li>
  <li><strong>INMP441</strong> I2S MEMS 麦克风——以 16kHz 采集音频</li>
  <li><strong>MAX98357A</strong> I2S 功放 + 喇叭——提供音频反馈</li>
  <li>总成本：零件不到 15 美元</li>
</ul>

<h2>模型如何工作</h2>
<p>团队使用了一个经过大量量化的小型 Transformer 模型（仅 200 万参数），专门针对命令短语进行训练。模型在 ESP32-S3 的双核处理器上推理时间不到 200ms。</p>
<pre><code>// 示例：注册语音命令
voice_cmd_register("开灯", [](void) {
    gpio_set_level(RELAY_PIN, HIGH);
    audio_play("lights_on.wav");
});

voice_cmd_register("设置定时器", [](void) {
    start_timer(DEFAULT_DURATION);
    audio_play("timer_started.wav");
});</code></pre>

<h2>实际表现</h2>
<p>我们在一个典型的客厅环境中测试了它，背景有电视的噪音。识别准确率令人印象深刻：</p>
<ul>
  <li>安静环境：<strong>94% 准确率</strong></li>
  <li>中等背景噪音：<strong>87% 准确率</strong></li>
  <li>嘈杂环境：<strong>71% 准确率</strong></li>
</ul>
<p>不完美，但对于一个 15 美元的全本地运行设备来说已经相当出色了。</p>

<blockquote>
  <p>"这东西完全在 ESP32 上运行，完全不需要云服务，这太疯狂了。这才是边缘 AI 该有的样子。"——社区贡献者</p>
</blockquote>

<h2>下一步</h2>
<p>项目路线图包括唤醒词检测、多语言支持和基于 Web 的自定义命令训练界面。GitHub 仓库已经有超过 2000 个 star，还在持续增长。</p>
`,

  'jetson-orin-nano-review': `
<h2>Jetson 系列终于亲民了</h2>
<p>NVIDIA 一直是 GPU 加速边缘计算的王者，但 Jetson 系列一直有个价格问题。初版 Orin Nano 起价 499 美元——工业应用没问题，但对爱好者和学生来说太贵了。新版本改变了一切。</p>

<h2>规格一览</h2>
<ul>
  <li><strong>GPU：</strong>1024 个 CUDA 核心 + 32 个 Tensor 核心</li>
  <li><strong>CPU：</strong>6 核 Arm Cortex-A78AE</li>
  <li><strong>AI 性能：</strong>最高 67 TOPS（INT8）</li>
  <li><strong>内存：</strong>8GB LPDDR5，102 GB/s 带宽</li>
  <li><strong>存储：</strong>M.2 NVMe 接口</li>
  <li><strong>价格：</strong>249 美元（开发套件）</li>
</ul>

<h2>跑分结果</h2>
<p>我们在几个流行模型上跑了标准的边缘 AI 基准测试套件：</p>
<figure>
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop" alt="测试设置" />
  <figcaption>我们使用 Jetson Orin Nano 开发套件进行的基准测试设置</figcaption>
</figure>
<p>亮点：YOLOv8n 在 640×640 分辨率下跑出 <strong>145 FPS</strong>。Whisper-tiny 转录速度达到<strong>实时的 12 倍</strong>。Stable Diffusion 生成一张 512×512 图片只需 <strong>8 秒</strong>。这些数据让它稳稳地进入了边缘 AI 开发"可用工作站"的级别。</p>

<h2>谁应该买？</h2>
<p>如果你在做任何需要强大端侧 AI 的项目——机器人、智能摄像头、本地 LLM 推理、实时目标检测——新版 Orin Nano 就是性价比的甜蜜点。它不是最便宜的板子，但在 300 美元以下，它是能力最强的，而且优势明显。</p>
`,

  'smart-camera-fire-detection': `
<h2>预防胜于检测</h2>
<p>大多数智能家居摄像头会在事情发生<em>之后</em>提醒你——入室盗窃、包裹被偷、火灾。来自柏林的新创公司 SafeSense 正在用一款摄像头来颠覆这种模式，它使用端侧 ML 来检测危险事件的<em>前兆</em>。</p>

<h2>工作原理</h2>
<p>这款摄像头使用了一个自定义视觉模型，基于数千小时展示家庭隐患早期迹象的录像进行训练：</p>
<ul>
  <li><strong>烟雾检测：</strong>在火灾报警器触发之前就能识别出微弱的烟雾</li>
  <li><strong>漏水检测：</strong>通过反射分析发现地面上的积水</li>
  <li><strong>燃气灶监控：</strong>追踪火焰状态，无人看管时发出警报</li>
  <li><strong>电气隐患：</strong>通过热成像模式检测打火花或过热的插座</li>
</ul>
<p>所有处理都在摄像头内置的专用边缘 AI 芯片上完成。除非你明确选择上传，否则任何录像都不会离开你的家。</p>

<blockquote>
  <p>"我们相信隐私和安全不应该是非此即彼的选择。一切都在本地运行。"——SafeSense CEO</p>
</blockquote>

<h2>价格与供货</h2>
<p>SafeSense 摄像头定价 129 美元，无需订阅。2026 年 3 月开始预订，预计 Q2 发货。</p>
`,

  'llama-raspberry-pi': `
<h2>本地 LLM 的期望</h2>
<p>在树莓派上运行大语言模型听起来像个派对把戏——演示起来很酷，但真的不能用。随着 Pi 5 规格的提升和最新的量化技术，我们想看看这个结论在 2026 年是否仍然成立。</p>

<h2>测试配置</h2>
<p>我们在树莓派 5（8GB 内存）上测试了三个量化版本的 Llama 2：</p>
<ul>
  <li><strong>Llama 2 7B Q4_K_M</strong>——4 位量化，4.1GB</li>
  <li><strong>Llama 2 7B Q2_K</strong>——2 位量化，2.7GB</li>
  <li><strong>TinyLlama 1.1B Q8_0</strong>——8 位量化，1.1GB</li>
</ul>

<h2>测试结果</h2>
<pre><code>模型                 | Tokens/秒 | 内存占用 | 质量
--------------------|-----------|---------|------
Llama 2 7B Q4_K_M   | 2.8 t/s   | 5.2GB   | 好
Llama 2 7B Q2_K     | 4.1 t/s   | 3.6GB   | 一般
TinyLlama 1.1B Q8_0 | 11.3 t/s  | 1.8GB   | 还行</code></pre>

<h2>结论</h2>
<p>能用吗？<strong>看情况。</strong>对于交互式聊天，即使每秒 4 个 token 也感觉很慢很痛苦。但对于批处理任务——摘要文本、分类输入、生成结构化数据——它出人意料地实用。TinyLlama 每秒 11 个 token，对简单任务来说真的能用。</p>
<p>Pi 5 短期内不会取代你的 GPU 服务器，但边缘 LLM 推理已经从"不可能"变成了"出乎意料地可行"，这才过了两年。</p>
`,
};

// 通用占位正文
const placeholderBodyEn = `
<h2>Article Coming Soon</h2>
<p>Our AI agents are still working on the full version of this article. Check back soon for the complete deep-dive, including detailed analysis, benchmarks, and hands-on impressions.</p>
<p>In the meantime, feel free to explore our other articles in the Discovery Stream.</p>
`;

const placeholderBodyZh = `
<h2>文章即将发布</h2>
<p>我们的 AI Agent 团队还在撰写这篇文章的完整版本。请稍后回来查看完整的深度分析，包括详细评测、性能数据和上手体验。</p>
<p>在此期间，欢迎浏览我们最新发现流中的其他文章。</p>
`;

/** 获取文章正文 HTML */
export function getArticleBody(slug: string, lang: 'en' | 'zh'): string {
  const bodies = lang === 'zh' ? articleBodiesZh : articleBodiesEn;
  const placeholder = lang === 'zh' ? placeholderBodyZh : placeholderBodyEn;
  return bodies[slug] || placeholder;
}
