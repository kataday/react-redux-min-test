// React
import React from 'react'
// ReactDom
import ReactDom from 'react-dom'
// reduxモジュールから使用するメンバをインポートする。
import { createStore, combineReducers } from 'redux'
// reactモジュールとreduxモジュールを連携させるために、react-reduxモジュールをインポートする。
import { Provider, connect } from 'react-redux'

import { createSelector } from 'reselect'

/* Actionの実装 ****************************************************************************************
Actionは、アプリケーションからStoreに送るデータのペイロードで、Storeから見ると唯一の情報源。
Actionは、Storeのdispatch()メソッドでStoreに送られる。
********************************************************************************************************/

// Action名の定義
const SEND1 = 'SEND1'
const SEND2 = 'SEND2'

// ActionCreator
// Viewから受け取った値をvalueとして受け取る
// Storeのdispatch()メソッドに、ActionCreatorを渡すことで、ReducerにActionが送られる。
function send1(value) {
	// Actionを返却する
	// Actionは必ず、typeプロパティを持ち、どういったアクションなのかを表す。
	// その他に持つプロパティは自由
	return {
		type: SEND1,
		value: value,
		// id: Date.now()
		id: 'AAA'
	}
}

function send2(value) {
	// Actionを返却する
	// Actionは必ず、typeプロパティを持ち、どういったアクションなのかを表す。
	// その他に持つプロパティは自由
	return {
		type: SEND2,
		value: value,
		id: Date.now()
	}
}

/* Reducerの実装 *****************************************************************************************************************
Storeのdispatch()メソッドにより送られたActionに呼応してアプリケーションの状態(state)をどのように変化させるかを指定する役割を持つ。
受け取ったActionのtypeプロパティを見て、対応する処理を行い、Storeの状態(state)を更新する。
Storeを、createStore()メソッドで作成する際に第一引数にReducerをセットすることで、Storeの更新が行えるようになっている。
**********************************************************************************************************************************/
// 初期stateの作成
// 今回は、単純化のためにvalueというstateのみ。
// 内容が複雑になる場合は、ネストしたツリー状の構造で表す。
const initialState = {
	value : null
}

// Reducer
// 現在の状態(state)と受け取ったActionを引数に取り、新しい状態(state)を返す。
// switch文で、受け取ったActionのtypeプロパティを判別し、処理を実装する。
// 状態(state)を更新する際、ES6のObject.assing()メソッドを使用して、stateそのものを変更するのではなく新しく作成する。
// 定義されていないaction.typeの場合は、現在の状態(state)をそのまま返す。
function formReducer1(state = initialState, action = {}) {
	switch (action.type) {
		case SEND1:
		console.log(SEND1 + action);
			return Object.assign({}, state, {
				item: {
					text: action.value + '[from SEND1]',
					id: action.id
				}
			})
			break;
		default:
		console.log('SEND1 default');
			return state
	}
}

function formReducer2(state = initialState, action = {}) {
	switch (action.type) {
		case SEND2:
		console.log(SEND2 + action);
			return Object.assign({}, state, {
				item: {
					text: action.value + '[from SEND2]',
					id: action.id
				}
			})
			break;
		default:
		console.log('SEND2 default');
			return state
	}
}

// 複数のReducerを作成する場合
// Storeを作成する際のcreateStore()の第一引数には1つのReducerしか渡せないため、reduxモジュールのcombineReducers(reducers)メソッドを使って1つにまとめる。
// const reducer1 = (state, action) => {}
// const reducer2 = (state, action) => {}
// const reducer3 = (state, action) => {}
// 

const reducer1 = formReducer1
const reducer2 = formReducer2
// const reducer = combineReducers({
// 	reducer1,
// 	reducer2
// })
function reducer(state = {}, action) {
  return {
    reducer1: formReducer1(state.reducer1, action),
    reducer2: formReducer2(state.reducer2, action)
  }
}

/* Storeの実装 *****************************************************************************************
Storeは、アプリケーションの状態(state)を持つ。
getState()メソッドを通して、状態(state)へのアクセスを許可する。
dispatch(action)メソッドを通して、状態(state)の更新を許可する。
subscribe(listner)メソッドを通して、リスナーを登録する。
subscribe(listner)メソッドから返された関数を通して、リスナーの登録解除をハンドリングする。
********************************************************************************************************/

// Storeの作成
// 第一引数にreducer、第二引数に初期stateを渡す
const store = createStore(reducer);

/* View(React)の実装 *************************************************************************************************************
reduxのViewとしてReactを使用する場合、Reactのコンポーネントは以下の2種類のどちらかとして実装する。
1.Container components:
	機能に関するコンポーネント。
	主に、reduxと連携しStoreの状態(state)を購読したり、Actionをdispatchする役割を持ち、データの取得や状態(state)の更新を行う。
	親となるコンポーネントがこの役割を担う。
2.Presentational components:
	見た目に関するコンポーネント。
	Container componentsから、propsを通してデータを受取り、Viewを構築する。
	また、propsを通して受け取ったコールバックを実行する。
**********************************************************************************************************************************/
// Presentational components
// データやコールバック関数などは、親であるContainer components(FormAppコンポーネント)からpropsを通して受け取る。
class FormInput extends React.Component {
	constructor(props) {
		super(props)
	}
	send(e) {
		e.preventDefault()
		// 下記のhandleClick()は、親コンポーネントから渡された処理。
		this.props.handleClick(this.myInput.value.trim())
		this.myInput.value = ''
		return;
	}
	
	render() {
		return (
			<form>
				<input type="text" ref={(ref) => (this.myInput = ref)} defaultValue="" />
				{/* 下記buttonのonClickに設定される処理(ボタン押下時)は、親コンポーネント(Container componentsであるFormApp)からpropsで渡されたhandleClickが実行される。 */}
				<button onClick={(event) => this.send(event)}>Submit</button>
			</form>
		)
	}
}
FormInput.propTypes = {
	handleClick: React.PropTypes.func.isRequired
}

class FormDisplay extends React.Component {
	constructor(props) {
		super(props)
	}
	
	render() {
		return (
			<ul>
        {this.props.items.map(item => (
          // <li key={item.id}>{item.text}</li>
					<li key={Math.random()}>{item.text}</li>
        ))}
      </ul>
		)
	}
}
FormDisplay.propTypes = {
	items: React.PropTypes.array
}

// Container components
// 子コンポーネントとして、FormInputコンポーネントとFormDisplayコンポーネントを実装する。
// propsを通して、reduxのStoreと連携する。
class FormApp extends React.Component {
	constructor(props) {
		super(props)
		
		this.state = {
			items: []
		}
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({
			items: this.state.items.concat(nextProps.item)
		})
	}
	
	render() {
		return (
			<div>
				<h1>TODO LIST</h1>
				<FormInput handleClick={this.props.onClick} />
				<FormDisplay items={this.state.items} />
			</div>
		)
	}
}
FormApp.propTypes = {
	onClick: React.PropTypes.func.isRequired,
	item: React.PropTypes.object
}

/* Reactとreduxの連携 *************************************************************************************************************
どのStoreと連携させるかを決める必要あるので、react-reduxモジュールからインポートしたProviderを使用する。
ProviderはReactのコンポーネントとして実装されているので、このProviderコンポーネントの子コンポーネントに、作成したContainer componentsを紐づける。
その際、store属性を通して、Container componentsにreduxの対象となるStoreを渡す。
***********************************************************************************************************************************/

// 渡されたStoreを、propsを通してReact内で使用出来るようにする。
// reduxモジュールのconnect()メソッドを使用する。
// connect(mapStateToProps, mapDispatchToProps)の戻り値である関数の引数に、Container componentsを渡すと、コンポーネントが返却される。
// mapStateToProps(state)、mapDispatchToProps(dispatch)は、それぞれ渡されたstate、dispatch()メソッドをpropsを通してContainer componentsで扱えるようにするもの。

// reselect
// const getItems = (state) => {return state};
// const mySelector = createSelector(
//   [ getItems ],
//   (item) => item
// );

// Storeのstate.valueをvalueとして扱えるようにする。
function mapStateToProps1(state) {
	// console.log(mySelector(state.reducer1.item));
	return {
		item: state.reducer1.item
		// item: mySelector(state.reducer1.item)
	}
}
// dispatch(send())を、onClick()として扱えるようにする。
function mapDispatchToProps1(dispatch) {
	return {
		onClick(value) {
			dispatch(send1(value))
		}
	}
}

const AppContainer1 = connect(
	mapStateToProps1,
	mapDispatchToProps1
)(FormApp)

function mapStateToProps2(state) {
	return {
		item: state.reducer2.item
	}
}
// dispatch(send())を、onClick()として扱えるようにする。
function mapDispatchToProps2(dispatch) {
	return {
		onClick(value) {
			dispatch(send2(value))
		}
	}
}

const AppContainer2 = connect(
	mapStateToProps2,
	mapDispatchToProps2
)(FormApp)

// レンダリングする。
ReactDom.render(
	<Provider store={store}>
		<div>
		<AppContainer1 />
		<AppContainer2 />
		</div>
	</Provider>,
	
	document.getElementById('app')
)
