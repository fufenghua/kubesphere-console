/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

const serviceModify = new RegExp('/api/v1/namespaces/(.*)/services/(.*)')
const kubeconfigView = new RegExp(
  '/kapis/resources.kubesphere.io/v1alpha2/users/(.*)/kubeconfig'
)
module.exports = async (ctx, next) => {
  // eslint-disable-next-line no-console
  console.log('进入拦截器')
  if (serviceModify.test(ctx.originalUrl) && ctx.method === 'PUT') {
    const can = ctx.headers['service-modify']
    if (can !== 'true') {
      ctx.response.body = {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Failure',
        message: '无权限设置公网访问',
        reason: 'Forbidden',
        code: 403,
      }
      ctx.status = 403
      return
    }
  } else if (kubeconfigView.test(ctx.originalUrl) && ctx.method === 'GET') {
    const can = ctx.headers['kubeconfig-view']
    if (can !== 'true') {
      ctx.response.body = {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Failure',
        message: '无权限查看kubeconfig',
        reason: 'Forbidden',
        code: 403,
      }
      ctx.status = 403
      return
    }
  }
  return await next()
}
