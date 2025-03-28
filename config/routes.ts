﻿export default [
  {
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU



	// {
	// 	path: '/employees',
	// 	name: 'Employees',
	// 	component: './DichVu/Employee',
	// 	icon: 'ArrowsAltOutlined',
	// },


	// {
	// 	path: '/chartdemo',
	// 	name: 'ChartChart',
	// 	component: './ChartDemoPage',
	// 	icon: 'ArrowsAltOutlined',
	// },

	// {
	// 	path: '/date',
	// 	name: 'datepicker',
	// 	component: './DatePickerDemoPage',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/tabview',
	// 	name: 'TabView Demo',
	// 	component: './TabViewPageDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/pdfviewer',
	// 	name: 'PDFViewer Demo',
	// 	component: './PDFViewerDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/errorboundary',
	// 	name: 'ErrorBoundary Demo',
	// 	component: './ErrorBoundaryDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/tinyeditor',
	// 	name: 'TinyEditor Demo',
	// 	component: './TinyEditorDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/upload',
	// 	name: 'Upload Demo',
	// 	component: './UploadDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/oidc',
	// 	name: 'OIDCBounder Demo',
	// 	component: './OIDCBounderDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },
	// {
	// 	path: '/tinyeditordichvu',
	// 	name: 'TinyEditor Demo - Dịch Vụ',
	// 	component: './TinyEditorDichVuDemo',
	// 	icon: 'ArrowsAltOutlined',
	// },

	
	{
		path: '/van-bang',
		name: 'Van Bang Demo',
		icon: 'book',
		routes: [
			{
				path: '/van-bang/so-van-bang',
				name: 'So van bang',
				component: './VanBang/SoVanBang',
			},
			{
				path: '/van-bang/quyet-dinh',
				name: 'Danh sach quyet dinh',
				component: './VanBang/QuyetDinh',
			},
			{
				path: '/van-bang/cau-hinh',
				name: 'Cau hinh',
				component: './VanBang/CauHinh',
			},
			{
				path: '/van-bang/ds-van-bang',
				name: 'Danh sach van bang',
				component: './VanBang/DSVanBang',
			},
			{
				path: '/van-bang/tra-cuu',
				name: 'Tra cuu',
				component: './VanBang/TraCuu',
			},
		],
	},


	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
