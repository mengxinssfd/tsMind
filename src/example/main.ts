/**
 * @Author: mengxinssfd
 * @Date: 2019-10-24 15:22
 * @Description:
 */

import {TsMind} from "../index";
import "./main.less";


// @ts-ignore
// const tsMindPro = import(/* webpackChunkName:"TsMind" */"../index");

(async function f() {
    // const {TsMind} = await tsMindPro;
    const tm = new TsMind({
        el: ".container",
        editable: false,
        // margin: 10,
        margin: 40,
        line: {
            color: "#FFA29E",
            width: 2
        },
        mode: "canvas",
        direct: "bottom"
    });

    tm.setData({
        id: "root",
        content: "root",
        isRoot: true,
        children: [
            /* {
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
                         children: [...new Array(5).keys()].map(i => ({
                             // children: [...new Array(799).keys()].map(i => ({
                             // children: [...new Array(1670).keys()].map(i => ({
                             // children: [...new Array(2000).keys()].map(i => ({
                             id: "subA" + i,
                             content: "subA" + i,
                         }))
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
             },*/

            /*  {
                  id: "sub7",
                  content: "sub8",
                  direct: "bottom",
                  children: [
                      {
                          id: "sub1013",
                          content: "sub1013",
                          children:[
                              {
                                  id: "sub1014",
                                  content: "sub1014",
                              },
                              {
                                  id: "sub1015",
                                  content: "sub1015",
                              },
                          ]
                      },
                      {
                          id: "sub10",
                          content: "sub10",
                          children: [
                              {
                                  id: "sub100",
                                  content: "sub100",
                                  children: [
                                      {
                                          id: "sub101",
                                          content: "sub101",
                                      },
                                      {
                                          id: "sub102",
                                          content: "sub102",
                                      }
                                  ]
                              },
                              {
                                  id: "sub103",
                                  content: "sub103",
                                  children: [
                                      {
                                          id: "sub1003",
                                          content: "sub1003",
                                      },
                                      {
                                          id: "sub1004",
                                          content: "sub1004",
                                      }
                                  ]
                              },
                          ]
                      },
                      {
                          id: "sub9",
                          content: "sub9",
                          children: [
                              {
                                  id: "sub11",
                                  content: "sub11",
                              },
                              {
                                  id: "sub12",
                                  content: "sub12",
                                  children: [
                                      {
                                          id: "sub15",
                                          content: "sub15",
                                      },
                                      {
                                          id: "sub16",
                                          content: "sub16aa",
                                      },
                                      {
                                          id: "sub17",
                                          content: "水电费水电费防守打法山东省地方",
                                      },
                                      {
                                          id: "sub18",
                                          content: "sub18bbbb",
                                      },
                                      {
                                          id: "sub19",
                                          content: "sub192",
                                      },
                                  ]
                              }
                          ]
                      },
                  ]
              }*/

            /*  {
                  id: "sub0",
                  content: "sub0",
                  direct: "bottom",
                  children: [...Array(6).keys()].map(index => ({
                      id: "subA" + index + 1,
                      content: "subA" + index + 1,
                      children: [
                          {
                              id: "sub1A" + index,
                              content: "sub1A" + index,
                          },
                      ]
                  }))
              },*/
            {
                id: "subB",
                content: "subB",
                direct: "left",
                children: [...Array(6).keys()].map(index => ({
                    id: "subB" + index,
                    content: "subB" + index,
                    children: [
                        {
                            id: "sub1B" + index,
                            content: "sub1B" + index,
                        },
                    ]
                }))
            },
            {
                id: "subC",
                content: "subC",
                direct: "right",
                children: [...Array(6).keys()].map(index => ({
                    id: "subC" + index,
                    content: "subC" + index,
                    children: [
                        {
                            id: "sub1C" + index,
                            content: "sub1C" + index,
                        },
                    ]
                }))
            }
        ],
    });
})();
