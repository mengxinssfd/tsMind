/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 15:22
 * @Description:
 */

import {TsMind} from "../index";
import "./main.less";

const tm = new TsMind({
    el: ".container",
    editable: false,
    margin: 20,
    line: {
        color: "",
        width: 1
    },
    mode: "html"
});

tm.setData({
    id: "root",
    content: "root",
    isRoot: true,
    children: [
        {
            id: "sub1",
            content: "sub1",
            children: [
                {
                    id: "sub2",
                    content: "sub2",
                },
                {
                    id: "sub3",
                    content: "sub3",
                }
            ]
        },
        {
            id: "sub4",
            content: "sub4",
            children: [
                {
                    id: "sub5",
                    content: "sub5555",
                },
                {
                    id: "sub66666",
                    content: "sub66666",
                }
            ]
        },
        {
            id: "sub7",
            content: "sub8",
            children: [
                {
                    id: "sub9",
                    content: "sub9",
                    children: [
                        {
                            id: "sub11",
                            content: "sub11",
                            children: [
                                {
                                    id: "sub15",
                                    content: "sub15",
                                },
                                {
                                    id: "sub16",
                                    content: "sub16",
                                },
                                {
                                    id: "sub17",
                                    content: "sub17",
                                },
                                {
                                    id: "sub18",
                                    content: "sub18",
                                },
                                {
                                    id: "sub19",
                                    content: "sub19",
                                },
                            ]
                        },
                        {
                            id: "sub12",
                            content: "sub12",
                        }
                    ]
                },
                {
                    id: "sub10",
                    content: "sub10",
                }
            ]
        }
    ],
});