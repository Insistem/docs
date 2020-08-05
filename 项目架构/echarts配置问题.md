# echarts使用经验总结大全

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

#### echarts的销毁

- echarts.dispose(), 销毁实例，实例销毁后无法再被使用, 构造函数的方法

- echartsInstance.clear()清空当前实例，会移除实例中所有的组件和图表, 实例的方法。

#### 使用echarts导致的内存波动解决方案

https://juejin.im/post/6844904180914585613

https://www.jianshu.com/p/8cbb05c1ec2f

切换路由时，组件被销毁，但在销毁组件的时候并没有销毁echarts实例。

所以将echarts实例创建，写成mixins，就不用每次都记着手动dispose了

```js
beforeDestory(){
  echarts.dispose(this.chart);
  this.chart = null;
}
```

#### 如何在项目中更优雅的使用echarts总结

https://segmentfault.com/a/1190000011230007