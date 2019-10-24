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
                    id: "sub3",
                    content: "sub3",
                },
                {
                    id: "sub4",
                    content: "sub4",
                }
            ]
        },
        {
            id: "sub2",
            content: "sub2",
        }
    ],
});