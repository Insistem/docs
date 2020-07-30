# echarts图表配置问题大全

#### y轴数值过大被遮挡问题

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200710143229027.png" alt="image-20200710143229027" style="zoom:50%;" />

通过设置 `grid: { left: 100 }`

#### 使用dataset 配置双y轴

```js
tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    },
    formatter: function (params) {
      const { yearMonth, payeeExpenseAmount, orgExpenseAmount, occupyOrgRingRatio, monthRingRatio, monthOrgRingRatio } = params[0].data
      return `月份: ${yearMonth}</br>报销对象: ${payeeExpenseAmount}</br>报销组织: ${orgExpenseAmount}</br>占比: ${occupyOrgRingRatio}%</br>报销对象环比：${monthRingRatio}%</br>报销组织环比：${monthOrgRingRatio}%`
    },
    data: ['payeeExpenseAmount', 'orgExpenseAmount', 'occupyOrgRingRatio', 'monthRingRatio']
  },
  toolbox: {
    feature: {
      dataView: { show: false, readOnly: false },
      magicType: { show: false, type: ['line', 'bar'] },
      restore: { show: false },
      saveAsImage: { show: false }
    }
  },
  legend: {
    data: ['报销对象', '报销组织', '占比']
  },
  xAxis: [
    {
      type: 'category',
      axisLabel: { interval: 0, rotate: 30 },
      axisPointer: { type: 'shadow' }
    }
  ],
  grid: {
    left: 100
  },
  yAxis: [
    {
      type: 'value',
      name: '金额(元)',
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '占比',
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: '{value}%'
      }
    }
  ],
  color: ['#00CBFF', '#FF9300'],
  series: [
    { name: '报销对象', type: 'bar', yAxisIndex: 0, barWidth: 20, encode: { y: ['payeeExpenseAmount'], x: 'yearMonth' } },
    { name: '报销组织', type: 'bar', yAxisIndex: 0, barWidth: 20, encode: { y: ['orgExpenseAmount'], x: 'yearMonth' } },
    { name: '占比', type: 'line', yAxisIndex: 1, encode: { y: ['occupyOrgRingRatio'], x: 'yearMonth' } },
  ]
```

### echarts中配置水印

http://ciika.com/2019/04/echat-watermark/

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200714102723854.png" alt="image-20200714102723854" style="zoom:50%;" />