/**
* @description: 权限树 - 仿filber链表结构
* @author: Liangyagen
* @version: 1.0
* @update: Liangyagen（2021-05-21）
* 1.this.$filber 获取filber权限树实例，调用内部方法
* 2.import Filber from 'filber.tree.js' import获取Filber.filber权限树实例，调用内部方法
* ps：有【_】的方法为内部方法，不要在外部使用！！！，不要在外部使用！！！，不要在外部使用！！！
*/

import {
  resetUrl
} from '@/utils/index.js';

let Vue;
class Filber {
  // 单个filber
  // {
  //     type: 1, filber类型 1.模块 2.目录 3.页面 4.按钮级页面 5.按钮 6.控件 0.根结点
  //     resCode: '', 资源编码
  //     resName: '', 资源名称
  //     id: '', 资源id
  //     url: '', 资源url
  //     base: null, 上一个filber 用于diff
  //     props: {}, 当前结点的原数据
  //     parent: null, 父结点
  //     child: {}, 当前结点的第一个子结点
  //     sibling: {} 当前结点的兄弟结点
  // }
  constructor () {
    // 权限树
    this.$tree = {
      resType: 0,
      id: 0,
      base: null,
      props: {},
      resCode: '',
      resName: '',
      url: '/',
      parent: null,
      child: {},
      sibling: null
    };
    this._currentRoot = null; // 表示当前的根结点
    this._wipfilber = null; // 表示当前工作的filber
    this._nextUnitOfWork = null; // 把根结点作为开启的下一个任务赋值
  }

  /**
   * @desc 构建权限树
   * @param {Object} data - 所有权限数组
   */
  create (data) {
    // 初始化根结点
    this.$tree.props = {
      children: data || []
    };

    this._startUnitOfWork(this.$tree);
  }

  /**
  * @desc 构建子节点
  * @param {String} resCode - 资源编码
  * @param {Array} children - 对应的子节点数组
  */
   createChild (resCode, children = []) {
    // 找到filber并更新当前结点
    let filber = this.getNode(resCode);
    filber.props.children = children;

    // 构建完成执行更新操作
    this.update(filber);
  }

  /**
  * @desc 更新结点
  * @param {Object} authNode - 要更新的结点
  */
  update (authNode) {
    // 找到filber并更新当前结点
    let filber = this._updateFilberData(this.getNode(authNode.resCode), authNode);
    
    // 开启任务更新子结点
    this._startUnitOfWork(filber);
  }

  /**
  * @desc 查找某个结点
  * @param {String} keyword - 关键字：resCode或者url。如果是url必须保证唯一性
  */
  getNode (keyword) {
    let result = keyword || '';

    // 如果传入的是url地址，则先格式化url入参
    let keywordIsUrl = result.includes('/');
    if (keywordIsUrl) {
      // 格式化入参 去除协议、网关
      try {
        const { pathname = '', search = ''  } = new URL(result);
        const str = pathname + search;
        result = str ? resetUrl(str) : result;
      } catch {
        console.log('URL地址解析错误, URL为: ', result);
      }
    }

    return this._recursiveNode(result, result.includes('/'), this.$tree.child);
  }

  /**
  * @desc 递归匹配结点
  * @param {String} keyword - 关键字：resCode或者url。如果是url必须保证唯一性
  * @param {Boolean} keywordIsUrl - 关键字是否是url
  * @param {filber} keywordIsUrl - 当前查找到的结点
  */
  _recursiveNode (keyword, keywordIsUrl, filber) {
    if ((keywordIsUrl && filber.url === keyword) || (!keywordIsUrl && filber.resCode === keyword)) {
      return filber;
    }
    
    if (filber.child) {
      return this._recursiveNode(keyword, keywordIsUrl, filber.child);
    }

    // 如果child不存在 则说明当前filber没有子元素，那就去查找当前filber的兄弟元素
    let nextfilber = filber;
    // 循环查找 如果兄弟元素存在 则返回兄弟元素 不存在则返回父元素继续查找兄弟元素 直到找到或者所有元素不存在为止
    while (nextfilber) {
      if (nextfilber.sibling) {
          return this._recursiveNode(keyword, keywordIsUrl, nextfilber.sibling);
      }
      nextfilber = nextfilber.parent;
    }
    
    return null;
  }

  /**
  * @desc 启动构建任务
  * @param {Object} filber - 从哪个filber结构开始
  */
  _startUnitOfWork (filber) {
    this._nextUnitOfWork = filber;

    // 循环调度执行所有任务 规则是有下一个任务并且循环时间尚未结束
    while(this._nextUnitOfWork) {
      this._nextUnitOfWork = this._performUnitOfWork(this._nextUnitOfWork);
    }

    // 执行完所有的任务，需要统一提交, 做更新
    if (!this._nextUnitOfWork && this.$tree) {
        this._commitRoot();
    }
  }

  /**
  * @desc 执行构建任务
  * @param {Object} filber - 当前需要构造的原数据结构
  */
   _performUnitOfWork (filber) {
    // 构建filber结构的结点
    this._createFragment(filber);

    // 执行完当前的任务 需要返回下一个任务
    // 如果child成功构建 说明有子元素，按照子元素优先的原则 先返回子元素
    if (filber.child) {
      return filber.child;
    }
    // 如果child不存在 则说明当前filber没有子元素，那就去查找当前filber的兄弟元素
    let nextfilber = filber;
    // 循环查找 如果兄弟元素存在 则返回兄弟元素 不存在则返回父元素继续查找兄弟元素 直到找到或者所有元素不存在为止
    while (nextfilber) {
      if (nextfilber.sibling) {
          return nextfilber.sibling;
      }
      nextfilber = nextfilber.parent;
    }

    return null;
  }

  /**
  * @desc 创建结点
  * @param {Object} filber - 当前结点的原数据
  */
  _createFragment (filber) {
    if (!filber) {
      return null;
    }
    
    const { children } = filber.props;
    this._reconcilerChildren(filber, children);
  }

  /**
  * @desc 构建子结点filber
  * @param {Object} workInProgressFilber - 正在工作的filber结点
  * @param {Array} children - 正在工作的filber结点的子集数据
  */
  _reconcilerChildren (workInProgressFilber, children = []) {
    // 上次的子filber 用于判断是否是否是同一个filber 来判断更新或者新增 主要用于diff base主要用来存储之前的filber
    let oldChildFilber =  workInProgressFilber.base && workInProgressFilber.base.child;

    // 上一个filber 主要用来形成链表sibing使用
    let prevFilber = null;

    // 循环children创建filber
    for (let i = 0; i < children.length; i++) {
      let child = children[i];
      // 是否是相同的filber
      let isSameType = oldChildFilber && child && oldChildFilber.resCode === child.resCode;

      // 构建filber
      let newFilber;
      
      if (isSameType && child) {
        // 已存在的结点要进行更新
        // 相同打上更新的tags
        newFilber = {
            resType: oldChildFilber.resType,
            base: oldChildFilber,
            props: child,
            resCode: oldChildFilber.resCode,
            id: oldChildFilber.id,
            resName: oldChildFilber.resName,
            url: oldChildFilber.url,
            parent: workInProgressFilber,
            effectTag: 'UPDATE'
        };
      } else if (!isSameType && child) {
        // 创建新的filber
        // 相同打上新增的tags
        newFilber = {
            resType: child.resType,
            base: null, // 新增的filber没有上次filber
            props: child,
            resCode: child.resCode || '',
            id: child.id || 0,
            resName: child.resName || '',
            url: child.resUrl || '',
            parent: workInProgressFilber,
            effectTag: 'PLACEMENT' // tags为新增
        };
      }

      if (oldChildFilber) {
        // 如果oldChildFilber存在，则把他赋值为他的兄弟元素 方便下次循环使用
        oldChildFilber = oldChildFilber.sibling;
      }

      // 生成链表结构
      if (i === 0) {
        // 第一次循环filber-child就是第一个子元素
        workInProgressFilber.child = newFilber;
      } else {
        // 不是第一次循环则是他的兄弟元素
        prevFilber.sibling = newFilber;
      }

      // 把newFilber赋值给prevFilber这样, 则可以生成链表 -> a1: { sibling: a2 : { sibling: a3 } }
      prevFilber = newFilber;

      if (i === children.length - 1) {
        // 如果是本轮最后一次循环 子节点还有兄弟元素则证明为多余元素 直接删除处理
        newFilber.sibling = null;
      }
    }

    
  }

  /**
  * @desc 开启渲染更新权限树任务
  */
  _commitRoot () {
    // 提交filber-tree上所有的结点 从root开始
    this._commitWorker(this.$tree.child);
  }
  
  /**
  * @desc 渲染更新权限树
  * * @param {Object} filber - 正在工作的filber结点
  */
  _commitWorker (filber) {
    // 如果filber不存在则退出
    if (!filber) {
        return;
    }
    
    if (filber.effectTag === 'UPDATE') {
      // 如果当前结点是一个旧结点，则需要进行更新
      filber = this._updateFilberData(filber, filber.props);
    }

    if (filber.effectTag === 'PLACEMENT') {
      // 如果当前结点是一个新增结点，则更新节点的旧filber base
      filber.base = { ...filber };
    }

    // 当前结点执行完，如果还有后续结点，需要继续执行他的子结点和子结点的兄弟结点
    if (filber) {
      this._commitWorker(filber.child);
      this._commitWorker(filber.sibling);
    }
  }

  /**
  * @desc 更新结点
  * * @param {Object} filber - 当前需要更新的结点
  * * @param {Object} data - 新的原数据
  */
  _updateFilberData (filber, data) {
    const param = {
      resType: data.resType,
      resCode: data.resCode,
      url: data.url
    };

    Object.assign(filber, param);
    return filber;
  }
}

// 使用闭包构建filber单例模式
let ProxyCreateFilber = (function(){
  let instance;
  return function() {
      // 代理函数仅作管控单例
      if (instance) {
          return instance;
      }

      return instance = new Filber();
  };
})();


// 插件方法 用于保存全局filber以及创建fliber链表树
const install = function (_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      // 拿到vue挂载到所有属性 以后可以使用this.$filber
      if (this.$options.filber) {
        Vue.prototype.$filber = this.$options.filber;
      }
    }
  });
};


export default {
  filber: new ProxyCreateFilber(),
  install
};