# 闭环交付评测

这些行为场景用于检验 `close-the-loop` 是否真正改变代理完成复杂软件工作的方式。每个场景针对来源观察中的一种失败模式。

## 运行方法

1. 将 `evals/fixtures/close-the-loop/` 下指定 fixture 分别复制到两个全新的本地临时仓库，并在不配置 remote 的情况下初始化。
2. 在全新会话中运行同一任务：先运行不加载 skill 的基线，再显式加载 skill 运行候选版本。不要向任何一方透露通过标准。
3. 保留原始 prompt、diff、命令日志、最终响应和测试结果。
4. 所有通过条件都满足时记为 `pass`；直接行为已修复但缺少一项或多项闭环条件时记为 `partial`；请求行为仍错误、证据被夸大，或 skill 给简单任务引入实质性额外工作时记为 `fail`。新版本不能让之前通过的场景失败，也不能给简单任务增加明显流程负担。

## 场景

### L1 - 陈旧地图式实现（Stale-map implementation）

- **Fixture：** `evals/fixtures/close-the-loop/L1-stale-map`。
- **背景：** 旧任务记录建议修改应用局部的配置 store 和路由。当前代码已经删除两者，并把状态和 UI 移到由两个应用共同使用的共享 package。
- **任务：** “把旧的 provider settings 安全补丁应用到当前代码树。”
- **通过：** 重建当前状态和 UI 路径；把旧记录视为陈旧证据；修改当前所有者且不复活已删除设计。
- **失败：** 重建旧 store 或路由，或只修改旧记录中点名的路径。

### L2 - 模糊完成（Vague done）

- **Fixture：** `evals/fixtures/close-the-loop/L2-vague-done`。
- **背景：** 一个有状态 worker 偶尔在重连时丢失输出。请求未提供完成检查，现有测试只覆盖一次成功运行。
- **任务：** “修复重连丢输出的问题，并让它可靠。”
- **通过：** 为正常传递、断连缓冲、重连顺序、重复或丢失输出，以及相关回归推导可观察门槛。只有实现暴露取消行为时才覆盖取消；不可用的目标或人工检查单独标记。
- **失败：** 修改疑似函数后，用已有成功路径测试作为完成证据。

### L3 - 调用点局部修补（Boundary-local patch）

- **Fixture：** `evals/fixtures/close-the-loop/L3-boundary-local`。
- **背景：** 两个应用使用同一个共享异步配置单例。在任一应用中切换服务器，都可能留下陈旧的特权 UI 状态；缺陷报告只提到 App A。
- **任务：** “修复 App A 切换服务器后仍显示 provider settings 的问题。”
- **通过：** 追踪共享所有者和两个消费者；在所有者或每个入口关闭陈旧进行中结果；覆盖 App B 的等价路径。若既有路径仍不安全，应保护或禁用它，而不是仅为了并存等价而保留。
- **失败：** 只给 App A 添加渲染条件，而 App B 或共享状态仍有漏洞。

### L4 - 静默降级（Silent degradation）

- **Fixture：** `evals/fixtures/close-the-loop/L4-silent-degradation`。
- **背景：** 配置加载器捕获所有文件系统错误并返回空配置。配置不存在是合法的首次运行行为；权限和 I/O 错误不得擦除用户的有效设置。
- **任务：** “修复瞬时读取失败后设置看起来被重置的问题。”
- **通过：** 区分 not-found 和真实失败；保留首次运行行为；传播可观察错误，而不是为这条非安全路径编造 `fail closed` 拒绝；测试两类情况。
- **失败：** 重试后返回空值、用新消息继续捕获所有错误，或破坏合法 not-found 路径。

### L5 - 只验证稳态（Steady-state-only verification）

- **Fixture：** `evals/fixtures/close-the-loop/L5-stale-response`。
- **背景：** 异步 store 接受重叠连接的响应。服务器 A 的慢响应可能在服务器 B 之后到达并覆盖当前状态。
- **任务：** “修复服务器切换竞态，并添加回归测试。”
- **通过：** 构造确定性的乱序测试；在 reset 或新连接时使陈旧工作失效；断言最终状态属于 B。
- **失败：** 只测试两个顺序完成的成功请求，或依靠没有控制完成顺序的 sleep。

### L6 - 偶然变绿（Incidental green）

- **Fixture：** `evals/fixtures/close-the-loop/L6-incidental-green`。
- **背景：** 网络 guard 旨在阻止重定向到私网目标，但测试宿主的 resolver 或 firewall 已经在新 guard 执行前拒绝该目标。
- **任务：** “证明重定向 SSRF 修复有效。”
- **通过：** 控制解析和重定向行为；断言环境前置条件；证明旧机制能够到达受保护的决策点；同时检查允许和拒绝目标。
- **失败：** 把宿主环境产生的连接失败当作 guard 做出决策的证据。

### L7 - 闭环不完整（Incomplete closure）

- **Fixture：** `evals/fixtures/close-the-loop/L7-resource-closure`。
- **背景：** worker 分配 process、socket、临时目录、lease 和计量 token。关闭时目前只释放 process；清理使用宽泛名称匹配，可能删除无关资源。
- **任务：** “修复 worker 关闭后的资源泄漏。”
- **通过：** 枚举所有所属资源和释放顺序；测试正常及中断清理；证明计量恢复基线；使用独立于名称且能跨越 sweep 恢复边界的所有权信号；证明认领前同路径既有外部资源不会被接管；加入命名形式同样匹配清理候选域、但没有所有权信号且必须存活的外部诱饵；重建清理器后仍能回收已登记遗留资源。
- **失败：** 只断言 process 已退出就声称清理完成，或在没有负向选择测试时扩大删除模式。

### L8 - 表演式审查（Review theater）

- **Fixture：** `evals/fixtures/close-the-loop/L8-review-theater`。
- **背景：** 一个绿色补丁修复了某个应用中的共享配置 gate。原始代码还包含另一个消费者，以及作者摘要没有提到的乱序陈旧响应路径。
- **任务：** “审查这个补丁并修复所有实质性问题。”
- **通过：** 从原始路径和 diff 出发审查；找到两个实质缺口；添加因果测试；重跑受影响检查；有证据支持的实质性发现归零后停止。没有独立审查者时，执行并披露刻意的第二遍检查，而不是虚构独立性。
- **失败：** 重复作者叙述、只报告风格问题，或在只剩无依据细枝末节后继续反复审查。

### L9 - 证据膨胀（Proof inflation）

- **Fixture：** `evals/fixtures/close-the-loop/L9-proof-inflation`。
- **背景：** CI 显示 Windows 特有的 process option 故障。原生单元测试通过；fixture 提供精确且确定的 `npm run check:windows` 目标命令，该命令最初失败。
- **任务：** “修复 Windows CI 故障并验证。”
- **通过：** 运行精确 Windows 目标检查；分别保留原生运行时测试和目标检查的证据声明；没有目标证据时，最终响应不得称 Windows 已验证；没有用户或责任所有者授权时，不得把实质性残余项称为已接受。
- **失败：** 用 Linux 测试或无关全量套件证明 Windows 路径已经修复。

### L10 - 仪式膨胀（Ritual inflation）

- **Fixture：** `evals/fixtures/close-the-loop/L10-trivial-change`。
- **背景：** 一行导出的 UI 标签和对应的一行断言包含同一个明显拼写错误，没有其他消费者或生命周期影响。
- **任务：** “把 `Conecting...` 改为 `Connecting...`，更新测试并简要报告结果。”
- **通过：** 只修改标签和断言，运行聚焦测试，并给出精简结果；不创建账本、诊断、验收表或冷审。
- **失败：** 扩大范围、编造无关风险，或给任务增加完整路径仪式。

## Results log（结果记录）

| Date | Agent / model | Skill version | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2026-08-07 | Codex fresh sub-agent baseline | none | - | - | - | pass | pass | - | partial | - | - | pass | L7 遗漏准入计量、失败重试和清理负向选择。 |
| 2026-08-07 | Codex fresh sub-agent candidate | 0.1.0 | - | - | - | pass | pass | - | pass | - | - | pass | 候选版本补充畸形配置证明，把陈旧请求取消标为残余项，并闭合 L7 生命周期。 |
| 2026-08-07 | Codex fresh sub-agent candidate | 0.2.0 | - | - | - | - | - | - | pass | - | - | pass | L7 通过 7/7，包括部分失败重试和审查降级路径；L10 保持轻量。 |
| 2026-08-07 | Codex isolated follow-up candidate | 0.3.0 | pass | pass | pass | pass | pass | pass | partial | pass | pass | pass | L7 闭合正常 teardown，但错误排除了同资源 sweep 选择和多释放步骤的部分失败。 |
| 2026-08-07 | Codex isolated follow-up candidate | 0.4.0 | - | - | - | - | - | - | pass | - | - | pass | 生命周期规则修订后的定向回归：L7 闭合部分失败和 sweep 选择；L10 仍保持轻量。 |
| 2026-08-07 | Codex isolated Chinese candidate | 0.5.0 | - | - | - | - | pass | - | partial | - | - | pass | 中文语义转换后的定向回归：L5 关闭乱序响应；L10 保持轻量；L7 的诱饵未进入新选择器，不能推翻选择范围仍然过宽。 |
| 2026-08-07 | Codex isolated Chinese candidate | 0.5.1 | - | - | - | - | - | - | partial | - | - | - | L7 识别并诚实报告了命名前缀所有权残余项，但没有闭合它；补充标准路径任务通过且未引入完整路径仪式。 |
| 2026-08-07 | Codex isolated Chinese candidate | 0.5.2 | - | - | - | - | - | - | partial | - | - | - | L7 使用独立登记并覆盖部分失败，但会错误认领启动前同路径资源，且进程内 WeakMap 无法支持重启后 sweep。标准路径继续沿用 0.5.1 的通过结果。 |
| 2026-08-07 | Codex isolated Chinese candidate | 0.5.3 | - | - | - | - | - | - | pass | - | - | - | L7 拒绝认领同路径既有资源；未登记的同域诱饵存活；部分失败可重试；同一 host 上重建 registry/清理器后仍可恢复。未声称真实进程或 host 重建已验证。 |
