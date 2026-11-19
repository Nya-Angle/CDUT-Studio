import { registerReviewIpc } from './review-ipc'
import { installC11LocalAuthorWorkbench } from './review-v3-main-local-author-workbench'
import { installC11LocalNativeProductIntake } from './review-v3-main-local-product-intake'
import { installC11NativeD4TechnicalPlan } from './review-v3-main-d4-local-plan'
import { installC11NativeB1TechnicalPlan } from './review-v3-main-b1-local-plan'

let installed = false

/** 延迟安装内容审核（Review）全量 IPC 与 C11 本机案卷能力 */
export function installReviewSubsystem(): void {
  if (installed) return
  installed = true
  registerReviewIpc()
  installC11LocalAuthorWorkbench()
  installC11LocalNativeProductIntake()
  installC11NativeD4TechnicalPlan()
  installC11NativeB1TechnicalPlan()
}
