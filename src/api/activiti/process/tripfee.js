import request from '@/utils/request'

export function batchSaveTempFee(data) {
  return request({
    url: '/act/process/tripfee',
    method: 'post',
    data
  })
}

export function showTripfeeInfo(tripId) {
  return request({
    url: `/act/process/tripfee/show/${tripId}`,
    method: 'get'
  })
}

