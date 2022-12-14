// import { useEffect, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core';
import { useEffect } from 'react';

const getStyles = makeStyles((theme: Theme) => ({
  container: {
    borderTopLeftRadius: '8px',
    borderBottomLeftRadius: '8px',
    overflow: 'auto',
    backgroundColor: 'white',
    // height: 'auto',
    // width: '100%',
  },
  rootNode: {
    transition: 'all .25s',
    cursor: 'pointer',
    transformOrigin: '50% 50%',
    transformBox: 'fill-box',

    '& circle': {
      transition: 'all .25s',
    },

    '& text': {
      transition: 'all .25s',
    },

    '&:hover, &.selectedNode': {
      transform: 'scale(1.1)',
      filter: 'drop-shadow(3px 3px 5px rgba(0, 0, 0, .2))',
      outline: 'none',
    },

    '&.selectedNode': {
      '& circle': {
        fill: theme.palette.primary.main,
        stroke: theme.palette.primary.main,
      },

      '& text': {
        fill: 'white',
      },
    },
  },
  childNode: {
    transition: 'all .25s',
    cursor: 'pointer',
    transformOrigin: '50% 50%',
    transformBox: 'fill-box',

    '& circle': {
      transition: 'all .25s',
    },

    '& text': {
      transition: 'all .25s',
    },

    '&:hover, &.selectedNode': {
      transform: 'scale(1.1)',
      filter: 'drop-shadow(3px 3px 5px rgba(0, 0, 0, .2))',
      outline: 'none',
    },

    '&.selectedNode': {
      '& svg path': {
        fill: 'white',
      },

      '& circle': {
        fill: theme.palette.primary.main,
        stroke: theme.palette.primary.main,
      },

      '& text': {
        fill: 'white',
      },
    },
  },
  subChild: {
    transition: 'all .25s',
    cursor: 'pointer',
    outline: 'none',

    '& circle': {
      transition: 'all .25s',
    },

    '& rect': {
      transition: 'all .25s',
    },

    '&:hover, &:focus': {
      transform: 'scale(1.05)',
      transformOrigin: 'center',
      filter: 'drop-shadow(3px 3px 5px rgba(0, 0, 0, .2))',

      '& rect': {
        opacity: 0,
      },

      '& .selected': {
        opacity: 1,
        transform: 'translate(-40px, -77px) scale(3)',
      },
    },
  },
}));

const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const setSelected = (el: any) => {
  const nodes = document.querySelectorAll<HTMLElement>('.selectedNode');
  nodes.forEach(n => n.classList.remove('selectedNode'));

  function getGParent(e: any): any {
    if (e.tagName === 'g') {
      return e;
    } else {
      return getGParent(e.parentElement);
    }
  }
  getGParent(el).classList.add('selectedNode');
};

const Topo = (props: any) => {
  const classes = getStyles();
  const { nodes, setNode, setCord } = props;

  useEffect(() => {
    const center = document.getElementById('center');
    if ((center as HTMLElement).dispatchEvent) {
      (center as HTMLElement).dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      (center as HTMLElement).focus();
    }
  }, [nodes.length]);

  const WIDTH = 800; // width for svg
  const HEIGHT = 600; // height for svg
  const LINE1 = 160; // line lenght from lv1 node
  const LINE2 = 270; // line lenght from lv2 node
  const ANGLE2 = 10; // angle offset for lv2 node
  const R1 = 68; // root node radius
  const R2 = 45; // lv1 node radius
  const R3 = 30; // lv2 node radius
  const LIMIT = 10; // limit to show lv1 node
  const BOUNDARY_ANGLE = 45; // boundary angle
  const START_DRAW_Y = HEIGHT / 4; // where we start to draw y axis
  const START_DRAW_X = WIDTH / 2; // where we start to draw x axis

  let steps = 0; // angle step to avoid graph out of boundary
  let centerNode: any;

  return (
    <div className={classes.container}>
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100%" height="100%" fill="white" />
        {nodes.map((node: any, index: number) => {
          if (node?.infos?.type?.toLowerCase() === 'rootcoord') {
            centerNode = node;
            return null;
          }
          const connectedLength = node?.connected.length;
          if (index < LIMIT) {
            let angle = (270 / nodes.length) * index + BOUNDARY_ANGLE * steps;
            if (
              (90 - BOUNDARY_ANGLE / 2 < angle &&
                angle < 90 + BOUNDARY_ANGLE / 2) ||
              (270 - BOUNDARY_ANGLE / 2 < angle &&
                angle < 270 + BOUNDARY_ANGLE / 2)
            ) {
              steps++;
              angle = angle + BOUNDARY_ANGLE;
            }
            const nodeCenterX =
              START_DRAW_X + LINE1 * Math.cos((angle * Math.PI) / 180);
            const nodeCenterY =
              START_DRAW_Y + LINE1 * Math.sin((angle * Math.PI) / 180);

            let childAngle = angle;
            if (
              (angle > BOUNDARY_ANGLE && angle < 90) ||
              (angle > 180 + BOUNDARY_ANGLE && angle < 270)
            ) {
              childAngle = angle - ANGLE2;
            }
            if (
              (angle > 270 && angle < 270 + BOUNDARY_ANGLE) ||
              (angle > 90 && angle < 90 + BOUNDARY_ANGLE)
            ) {
              childAngle = angle + ANGLE2;
            }

            const childNodeCenterX =
              START_DRAW_X + LINE2 * Math.cos((childAngle * Math.PI) / 180);
            const childNodeCenterY =
              START_DRAW_Y + LINE2 * Math.sin((childAngle * Math.PI) / 180);

            let icon;
            switch (node?.infos?.type) {
              case 'DataCoord':
                icon = (
                  <path
                    d="M17.7057 0.500355C14.8388 0.500355 12.5933 1.74358 12.5933 3.3308V6.21129C12.2422 6.17047 11.8771 6.14775 11.5009 6.14775C11.1239 6.14775 10.7588 6.17047 10.407 6.21129V3.33044C10.407 1.74322 8.16189 0.5 5.29604 0.5C2.42907 0.5 0.183594 1.74322 0.183594 3.33044V11.0216C0.183594 12.6085 2.42944 13.8517 5.29604 13.8517C5.66634 13.8517 6.03035 13.8236 6.38844 13.781V16.67C6.38844 18.2569 8.63429 19.5001 11.5009 19.5001C14.3671 19.5001 16.6118 18.2569 16.6118 16.67V13.781C16.9703 13.8236 17.3347 13.8517 17.7057 13.8517C20.5716 13.8517 22.8167 12.6085 22.8167 11.0216V3.3308C22.8171 1.74393 20.5716 0.500355 17.7057 0.500355ZM17.7057 1.03286C20.1754 1.03286 22.2618 2.08509 22.2618 3.3308C22.2618 4.57615 20.175 5.62838 17.7057 5.62838C15.235 5.62838 13.1482 4.57615 13.1482 3.3308C13.1482 2.08545 15.2353 1.03286 17.7057 1.03286ZM16.0569 8.97854C16.0569 10.2239 13.9705 11.2765 11.5009 11.2765C9.03049 11.2765 6.94334 10.2243 6.94334 8.97854C6.94334 7.73284 9.03049 6.68061 11.5009 6.68061C13.9709 6.68061 16.0569 7.73284 16.0569 8.97854ZM22.2622 8.45172C22.2622 8.45421 22.2607 8.45634 22.2607 8.45882C22.2607 9.70382 20.1739 10.756 17.7046 10.756C17.3325 10.756 16.9681 10.7273 16.6122 10.6822V8.9789C16.6122 8.86707 16.5982 8.75702 16.5763 8.64875C16.9452 8.69383 17.3206 8.72507 17.7046 8.72507C19.7211 8.72507 21.4265 8.10843 22.2622 7.19075V8.45172V8.45172ZM16.0569 11.5356C16.0569 11.5381 16.0555 11.5402 16.0555 11.5427C16.0555 12.7884 13.9691 13.8407 11.4994 13.8407C9.02975 13.8407 6.94334 12.7884 6.94334 11.5427V10.2761C7.78012 11.1931 9.48513 11.809 11.5009 11.809C13.5163 11.809 15.2202 11.1931 16.0569 10.2764V11.5356ZM6.94334 12.8403C7.77975 13.7569 9.48439 14.3728 11.4994 14.3728C13.5159 14.3728 15.2209 13.7562 16.0569 12.8385V14.0998C16.0569 14.1023 16.0555 14.1044 16.0555 14.1069C16.0555 15.3523 13.9691 16.4042 11.4994 16.4042C9.02975 16.4042 6.94334 15.3523 6.94334 14.1069V12.8403V12.8403ZM5.29604 1.03286C7.76569 1.03286 9.8521 2.08509 9.8521 3.3308C9.8521 4.57615 7.76569 5.62838 5.29604 5.62838C2.82564 5.62838 0.73849 4.57615 0.73849 3.3308C0.73849 2.08545 2.82564 1.03286 5.29604 1.03286ZM5.29604 6.16088C7.31142 6.16088 9.01569 5.54495 9.8521 4.62833V6.29543C8.32466 6.57517 7.1394 7.23441 6.64369 8.08252C6.20791 8.1521 5.75623 8.19221 5.29456 8.19221C2.8249 8.19221 0.73849 7.13998 0.73849 5.89463V4.62833C1.57527 5.54495 3.27991 6.16088 5.29604 6.16088ZM5.29456 8.72472C5.67891 8.72472 6.05476 8.69383 6.42432 8.64804C6.4025 8.75667 6.38844 8.86636 6.38844 8.97854V10.6819C6.03146 10.7269 5.66597 10.7557 5.29456 10.7557C2.8249 10.7557 0.73849 9.70382 0.73849 8.45846V7.19217C1.5749 8.10879 3.27917 8.72472 5.29456 8.72472ZM5.29604 13.3195C2.82564 13.3195 0.73849 12.2673 0.73849 11.0219V9.756C1.5749 10.6726 3.27954 11.2882 5.29456 11.2882C5.66523 11.2882 6.02998 11.2602 6.38844 11.2176V13.2457C6.03183 13.2908 5.66708 13.3195 5.29604 13.3195ZM11.5009 18.9676C9.03049 18.9676 6.94334 17.9154 6.94334 16.67V15.4041C7.77975 16.3207 9.48439 16.9363 11.4994 16.9363C13.5159 16.9363 15.2209 16.3197 16.0569 15.4023V16.67C16.0569 17.9154 13.9709 18.9676 11.5009 18.9676ZM17.7057 13.3195C17.334 13.3195 16.9688 13.2908 16.6118 13.2453V11.2179C16.9688 11.2602 17.3328 11.2882 17.7043 11.2882C19.7207 11.2882 21.4261 10.6716 22.2618 9.75423V11.0219C22.2622 12.2673 20.1754 13.3195 17.7057 13.3195ZM22.2622 5.88789C22.2622 5.89037 22.2607 5.8925 22.2607 5.89499C22.2607 7.14034 20.1739 8.19257 17.7046 8.19257C17.2429 8.19257 16.792 8.15281 16.3566 8.08323C15.8613 7.23477 14.676 6.57517 13.1482 6.29578V4.62869C13.985 5.54531 15.6896 6.16124 17.7057 6.16124C19.7207 6.16124 21.4254 5.54531 22.2618 4.62869V5.88789H22.2622Z"
                    fill="#82838E"
                  />
                );
                break;
              case 'IndexCoord':
                icon = (
                  <path
                    d="M3.95578 0.216797V0.568651V3.03163H3.32708H3.01273V3.38349V5.84647H2.38403H2.06969V6.19832V8.6613H1.44099H1.12664V9.01316V11.4761H0.497942H0.183594V11.828V18.8651V19.2169H0.497942H22.5023H22.8167V18.8651V11.828V11.4761H22.5023H21.8736V9.01316V8.6613H21.5593H20.9306V6.19832V5.84647H20.6163H19.9876V3.38349V3.03163H19.6732H19.0445V0.568651V0.216797H18.7302H4.27013H3.95578ZM4.58447 0.920506H18.4158V3.03163H4.58447V0.920506ZM3.64143 3.73534H19.3589V5.84647H3.64143V3.73534ZM2.69838 6.55018H20.3019V8.6613H2.69838V6.55018ZM1.75534 9.36501H21.2449V11.4761H15.901H15.6849L15.6063 11.696L14.7419 14.291H8.25842L7.39396 11.696L7.31538 11.4761H7.09926H1.75534V9.36501ZM0.812291 12.1798H6.88315L7.74761 14.7638L7.82619 14.9947H8.04231H14.958H15.1741L15.2527 14.7638L16.1171 12.1798H22.188V18.5132H0.812291V12.1798Z"
                    fill="#82838E"
                  />
                );
                break;
              case 'QueryCoord':
                icon = (
                  <g>
                    <path
                      d="M18.1879 0.216797C17.7141 0.216797 13.9044 0.244991 13.1919 1.13616H6.81954C6.65636 0.608751 6.08944 0.216797 5.41118 0.216797C4.60588 0.216797 3.95098 0.766575 3.95098 1.44261C3.95098 2.01231 4.41824 2.48793 5.04613 2.62491V4.50715H1.76068C1.15688 4.50715 0.665527 4.91964 0.665527 5.42651V10.3298C0.665527 10.8366 1.15688 11.2491 1.76068 11.2491H5.04613V12.4749H1.76068C1.15688 12.4749 0.665527 12.8874 0.665527 13.3943V18.2976C0.665527 18.8044 1.15688 19.2169 1.76068 19.2169H9.06168C9.66547 19.2169 10.1568 18.8044 10.1568 18.2976V13.3943C10.1568 12.8874 9.66547 12.4749 9.06168 12.4749H5.77623V11.2491H9.06168C9.66547 11.2491 10.1568 10.8366 10.1568 10.3298V5.42651C10.1568 4.91964 9.66547 4.50715 9.06168 4.50715H5.77623V2.62491C6.28693 2.51336 6.68666 2.17779 6.81954 1.74907H13.0772V6.95878C13.0772 7.30415 13.4547 7.51775 13.777 7.6437C13.5635 8.09634 13.4423 8.5882 13.4423 9.10396C13.4423 10.9837 15.0032 12.5598 17.0928 12.9766V13.7008C17.0928 13.7195 17.0975 13.7372 17.0993 13.7556C16.6719 13.881 16.3627 14.219 16.3627 14.6201V17.6847C16.3627 18.5296 17.1815 19.2169 18.1879 19.2169C19.1944 19.2169 20.0132 18.5296 20.0132 17.6847V14.6201C20.0132 14.219 19.704 13.881 19.2765 13.7556C19.2783 13.7372 19.2831 13.7195 19.2831 13.7008V12.9766C21.3726 12.5598 22.9336 10.9837 22.9336 9.10396C22.9336 8.5882 22.8124 8.09634 22.5988 7.6437C22.9201 7.51837 23.2986 7.30446 23.2986 6.95878V1.44261C23.2986 0.25112 18.711 0.216797 18.1879 0.216797ZM9.42673 18.2976C9.42673 18.4667 9.26282 18.604 9.06168 18.604H1.76068C1.55953 18.604 1.39563 18.4667 1.39563 18.2976V15.5395H9.42673V18.2976ZM9.06168 13.0879C9.26282 13.0879 9.42673 13.2251 9.42673 13.3943V14.9266H1.39563V13.3943C1.39563 13.2251 1.55953 13.0879 1.76068 13.0879H9.06168ZM9.42673 10.3298C9.42673 10.4989 9.26282 10.6362 9.06168 10.6362H1.76068C1.55953 10.6362 1.39563 10.4989 1.39563 10.3298V7.57169H9.42673V10.3298ZM9.06168 5.12006C9.26282 5.12006 9.42673 5.25735 9.42673 5.42651V6.95878H1.39563V5.42651C1.39563 5.25735 1.55953 5.12006 1.76068 5.12006H9.06168ZM5.41118 2.05552C5.00853 2.05552 4.68108 1.78063 4.68108 1.44261C4.68108 1.10459 5.00853 0.829704 5.41118 0.829704C5.81383 0.829704 6.14128 1.10459 6.14128 1.44261C6.14128 1.78063 5.81383 2.05552 5.41118 2.05552ZM18.1879 0.829704C20.7177 0.829704 22.2867 1.20756 22.5484 1.44261C22.2867 1.67766 20.7177 2.05552 18.1879 2.05552C15.6581 2.05552 14.0891 1.67766 13.8274 1.44261C14.0891 1.20756 15.6581 0.829704 18.1879 0.829704ZM13.8073 6.93641V5.81663C14.1209 5.93798 14.5367 6.04003 15.0503 6.12308C14.675 6.40165 14.3534 6.72833 14.0983 7.09301C13.899 7.01609 13.8274 6.95725 13.8073 6.93641ZM19.2831 14.6201V17.6847C19.2831 18.1915 18.7917 18.604 18.1879 18.604C17.5841 18.604 17.0928 18.1915 17.0928 17.6847V14.6201C17.0928 14.451 17.2567 14.3137 17.4578 14.3137H17.8229H18.553H18.918C19.1192 14.3137 19.2831 14.451 19.2831 14.6201ZM17.8229 13.7008V13.0722C17.9437 13.0802 18.0645 13.0879 18.1879 13.0879C18.3113 13.0879 18.4321 13.0802 18.553 13.0722V13.7008H17.8229ZM18.1879 12.4749C15.9739 12.4749 14.1724 10.9626 14.1724 9.10396C14.1724 7.24531 15.9739 5.73297 18.1879 5.73297C20.402 5.73297 22.2035 7.24531 22.2035 9.10396C22.2035 10.9626 20.402 12.4749 18.1879 12.4749ZM22.5685 6.93641C22.5484 6.95725 22.4769 7.01609 22.2776 7.0927C22.0224 6.72833 21.7008 6.40134 21.3255 6.12277C21.8395 6.03973 22.2549 5.93768 22.5685 5.81632V6.93641ZM22.5685 5.09738C22.49 5.18993 21.9709 5.45225 20.4764 5.61621C19.7974 5.30087 19.0177 5.12006 18.1879 5.12006C17.3582 5.12006 16.5788 5.30087 15.8994 5.6159C14.4049 5.45195 13.8858 5.18962 13.8073 5.09707V3.97699C15.1237 4.48784 17.7962 4.50715 18.1879 4.50715C18.5796 4.50715 21.2522 4.48784 22.5685 3.97729V5.09738ZM22.5685 3.25774C22.3918 3.49003 20.805 3.89424 18.1879 3.89424C15.5709 3.89424 13.984 3.49003 13.8073 3.25774V2.13857C15.1237 2.64912 17.7962 2.66843 18.1879 2.66843C18.5796 2.66843 21.2522 2.64912 22.5685 2.13857V3.25774Z"
                      fill="#82838E"
                    />
                    <path
                      d="M18.1878 6.3457C16.3764 6.3457 14.9023 7.58286 14.9023 9.10379C14.9023 10.6247 16.3764 11.8619 18.1878 11.8619C19.9992 11.8619 21.4732 10.6247 21.4732 9.10379C21.4732 7.58286 19.9992 6.3457 18.1878 6.3457ZM18.1878 11.249C16.7787 11.249 15.6324 10.2864 15.6324 9.10379C15.6324 7.92118 16.7787 6.95861 18.1878 6.95861C19.5969 6.95861 20.7431 7.92118 20.7431 9.10379C20.7431 10.2864 19.5969 11.249 18.1878 11.249Z"
                      fill="#82838E"
                    />
                    <path
                      d="M18.5529 8.79736H17.8228V9.41027H18.5529V8.79736Z"
                      fill="#82838E"
                    />
                    <path
                      d="M20.0133 8.79736H19.2832V9.41027H20.0133V8.79736Z"
                      fill="#82838E"
                    />
                    <path
                      d="M17.0929 8.79736H16.3628V9.41027H17.0929V8.79736Z"
                      fill="#82838E"
                    />
                    <path
                      d="M2.85608 5.73291H2.12598V6.34582H2.85608V5.73291Z"
                      fill="#82838E"
                    />
                    <path
                      d="M4.31604 5.73291H3.58594V6.34582H4.31604V5.73291Z"
                      fill="#82838E"
                    />
                    <path
                      d="M5.776 5.73291H5.0459V6.34582H5.776V5.73291Z"
                      fill="#82838E"
                    />
                    <path
                      d="M5.04638 8.18457H2.12598V10.0233H5.04638V8.18457ZM4.31628 9.41039H2.85608V8.79748H4.31628V9.41039Z"
                      fill="#82838E"
                    />
                    <path
                      d="M8.69628 8.18457H5.77588V8.79748H8.69628V8.18457Z"
                      fill="#82838E"
                    />
                    <path
                      d="M8.69628 9.41064H5.77588V10.0236H8.69628V9.41064Z"
                      fill="#82838E"
                    />
                    <path
                      d="M2.85608 13.7007H2.12598V14.3136H2.85608V13.7007Z"
                      fill="#82838E"
                    />
                    <path
                      d="M4.31604 13.7007H3.58594V14.3136H4.31604V13.7007Z"
                      fill="#82838E"
                    />
                    <path
                      d="M5.776 13.7007H5.0459V14.3136H5.776V13.7007Z"
                      fill="#82838E"
                    />
                    <path
                      d="M5.04638 16.1523H2.12598V17.9911H5.04638V16.1523ZM4.31628 17.3782H2.85608V16.7653H4.31628V17.3782Z"
                      fill="#82838E"
                    />
                    <path
                      d="M8.69628 16.1523H5.77588V16.7653H8.69628V16.1523Z"
                      fill="#82838E"
                    />
                    <path
                      d="M8.69628 17.3782H5.77588V17.9911H8.69628V17.3782Z"
                      fill="#82838E"
                    />
                  </g>
                );
                break;
              default:
                icon = (
                  <g>
                    <path
                      d="M10.9028 5.52795C10.9028 4.05527 8.19884 3.28271 5.54319 3.28271C2.88753 3.28271 0.183594 4.05527 0.183594 5.52795V13.9295C0.183594 15.4022 2.88753 16.1747 5.54319 16.1747C8.19884 16.1747 10.9028 15.4022 10.9028 13.9295V5.52795ZM5.54319 4.24841C8.39198 4.24841 9.93709 5.09339 9.93709 5.52795C9.93709 5.96251 8.39198 6.80749 5.54319 6.80749C2.69439 6.80749 1.14929 5.96251 1.14929 5.52795C1.14929 5.09339 2.69439 4.24841 5.54319 4.24841ZM1.14929 6.87992C2.16326 7.48348 3.85323 7.77319 5.54319 7.77319C7.23315 7.77319 8.92311 7.45934 9.93709 6.87992V9.65629C9.93709 10.0908 8.39198 10.9358 5.54319 10.9358C2.69439 10.9358 1.14929 10.0908 1.14929 9.65629V6.87992ZM5.54319 15.209C2.69439 15.209 1.14929 14.364 1.14929 13.9295V10.9841C2.18741 11.5877 3.87737 11.9015 5.54319 11.9015C7.20901 11.9015 8.92311 11.5877 9.93709 11.0083V13.9295C9.93709 14.364 8.39198 15.209 5.54319 15.209Z"
                      fill="#82838E"
                    />
                    <path
                      d="M5.27777 9.92175H5.8089C5.93696 9.92175 6.05977 9.87088 6.15032 9.78033C6.24087 9.68977 6.29175 9.56696 6.29175 9.4389C6.29175 9.31084 6.24087 9.18803 6.15032 9.09748C6.05977 9.00693 5.93696 8.95605 5.8089 8.95605H5.27777C5.14971 8.95605 5.0269 9.00693 4.93634 9.09748C4.84579 9.18803 4.79492 9.31084 4.79492 9.4389C4.79492 9.56696 4.84579 9.68977 4.93634 9.78033C5.0269 9.87088 5.14971 9.92175 5.27777 9.92175Z"
                      fill="#82838E"
                    />
                    <path
                      d="M5.8089 12.988H5.27777C5.14971 12.988 5.0269 13.0389 4.93634 13.1295C4.84579 13.22 4.79492 13.3428 4.79492 13.4709C4.79492 13.5989 4.84579 13.7218 4.93634 13.8123C5.0269 13.9029 5.14971 13.9537 5.27777 13.9537H5.8089C5.93696 13.9537 6.05977 13.9029 6.15032 13.8123C6.24087 13.7218 6.29175 13.5989 6.29175 13.4709C6.29175 13.3428 6.24087 13.22 6.15032 13.1295C6.05977 13.0389 5.93696 12.988 5.8089 12.988Z"
                      fill="#82838E"
                    />
                    <path
                      d="M12.5928 4.22429V15.2332C12.5928 15.8735 12.8471 16.4875 13.2999 16.9403C13.7526 17.3931 14.3667 17.6474 15.007 17.6474H15.7313V16.6817H15.007C14.6228 16.6817 14.2544 16.5291 13.9827 16.2575C13.7111 15.9858 13.5585 15.6174 13.5585 15.2332V10.2116H15.7313V9.24589H13.5585V4.22429C13.5585 3.84011 13.7111 3.47167 13.9827 3.20002C14.2544 2.92836 14.6228 2.77575 15.007 2.77575H15.7313V1.81006H15.007C14.3667 1.81006 13.7526 2.06441 13.2999 2.51717C12.8471 2.96993 12.5928 3.584 12.5928 4.22429Z"
                      fill="#82838E"
                    />
                    <path
                      d="M19.1108 11.9741H20.5594C21.158 11.9741 21.7322 11.7363 22.1555 11.3129C22.5788 10.8896 22.8167 10.3155 22.8167 9.71678C22.8167 9.1181 22.5788 8.54395 22.1555 8.12062C21.7322 7.6973 21.158 7.45947 20.5594 7.45947H19.1108C18.5121 7.45947 17.938 7.6973 17.5147 8.12062C17.0913 8.54395 16.8535 9.1181 16.8535 9.71678C16.8535 10.3155 17.0913 10.8896 17.5147 11.3129C17.938 11.7363 18.5121 11.9741 19.1108 11.9741ZM19.1108 8.42517H20.5594C20.9019 8.42517 21.2304 8.56125 21.4727 8.80347C21.7149 9.04569 21.851 9.37422 21.851 9.71678C21.851 10.0593 21.7149 10.3879 21.4727 10.6301C21.2304 10.8723 20.9019 11.0084 20.5594 11.0084H19.1108C18.7683 11.0084 18.4397 10.8723 18.1975 10.6301C17.9553 10.3879 17.8192 10.0593 17.8192 9.71678C17.8192 9.37422 17.9553 9.04569 18.1975 8.80347C18.4397 8.56125 18.7683 8.42517 19.1108 8.42517Z"
                      fill="#82838E"
                    />
                    <path
                      d="M19.1108 19.217H20.5594C21.158 19.217 21.7322 18.9792 22.1555 18.5559C22.5788 18.1325 22.8167 17.5584 22.8167 16.9597C22.8167 16.361 22.5788 15.7869 22.1555 15.3635C21.7322 14.9402 21.158 14.7024 20.5594 14.7024H19.1108C18.5121 14.7024 17.938 14.9402 17.5147 15.3635C17.0913 15.7869 16.8535 16.361 16.8535 16.9597C16.8535 17.5584 17.0913 18.1325 17.5147 18.5559C17.938 18.9792 18.5121 19.217 19.1108 19.217ZM19.1108 15.6681H20.5594C20.9019 15.6681 21.2304 15.8042 21.4727 16.0464C21.7149 16.2886 21.851 16.6171 21.851 16.9597C21.851 17.3023 21.7149 17.6308 21.4727 17.873C21.2304 18.1152 20.9019 18.2513 20.5594 18.2513H19.1108C18.7683 18.2513 18.4397 18.1152 18.1975 17.873C17.9553 17.6308 17.8192 17.3023 17.8192 16.9597C17.8192 16.6171 17.9553 16.2886 18.1975 16.0464C18.4397 15.8042 18.7683 15.6681 19.1108 15.6681Z"
                      fill="#82838E"
                    />
                    <path
                      d="M19.1108 4.73141H20.5594C21.158 4.73141 21.7322 4.49359 22.1555 4.07026C22.5788 3.64693 22.8167 3.07278 22.8167 2.4741C22.8167 1.87543 22.5788 1.30127 22.1555 0.877947C21.7322 0.454619 21.158 0.216797 20.5594 0.216797H19.1108C18.5121 0.216797 17.938 0.454619 17.5147 0.877947C17.0913 1.30127 16.8535 1.87543 16.8535 2.4741C16.8535 3.07278 17.0913 3.64693 17.5147 4.07026C17.938 4.49359 18.5121 4.73141 19.1108 4.73141ZM19.1108 1.18249H20.5594C20.9019 1.18249 21.2304 1.31857 21.4727 1.56079C21.7149 1.80302 21.851 2.13155 21.851 2.4741C21.851 2.81666 21.7149 3.14519 21.4727 3.38741C21.2304 3.62964 20.9019 3.76572 20.5594 3.76572H19.1108C18.7683 3.76572 18.4397 3.62964 18.1975 3.38741C17.9553 3.14519 17.8192 2.81666 17.8192 2.4741C17.8192 2.13155 17.9553 1.80302 18.1975 1.56079C18.4397 1.31857 18.7683 1.18249 19.1108 1.18249Z"
                      fill="#82838E"
                    />
                  </g>
                );
                break;
            }

            return (
              <g key={`${node?.infos?.name}`}>
                <line
                  x1={`${START_DRAW_X}`}
                  y1={`${START_DRAW_Y}`}
                  x2={nodeCenterX}
                  y2={nodeCenterY}
                  stroke="#06AFF2"
                />
                {connectedLength && (
                  <line
                    x1={nodeCenterX}
                    y1={nodeCenterY}
                    x2={childNodeCenterX}
                    y2={childNodeCenterY}
                    stroke="#06AFF2"
                  />
                )}
                <g
                  className={classes.childNode}
                  tabIndex={0}
                  onClick={e => {
                    setNode(node);
                    setSelected(e.target);
                  }}
                >
                  <circle
                    cx={nodeCenterX}
                    cy={nodeCenterY}
                    r={R2}
                    fill="white"
                    stroke="#06AFF2"
                  />
                  {icon && (
                    <svg
                      x={nodeCenterX - 12}
                      y={nodeCenterY - 20}
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      preserveAspectRatio="none"
                    >
                      {icon}
                    </svg>
                  )}
                  <text
                    fontFamily="Roboto"
                    textAnchor="middle"
                    fill="#06AFF2"
                    fontWeight="700"
                    fontSize="12"
                    x={nodeCenterX}
                    y={nodeCenterY + 18}
                  >
                    {capitalize(node?.infos?.name)}
                  </text>
                </g>

                {connectedLength && (
                  <>
                    <svg
                      tabIndex={0}
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      x={childNodeCenterX - 30}
                      y={childNodeCenterY - 30}
                      className={classes.subChild}
                      onClick={() => {
                        setCord(node);
                      }}
                    >
                      <circle
                        cx="30"
                        cy="30"
                        r={R3}
                        fill="white"
                        stroke="#06AFF2"
                      />
                      <rect
                        opacity="0.28"
                        x="10"
                        y="8"
                        width="1"
                        height="44"
                        fill="#E9E9ED"
                      />
                      <rect
                        opacity="0.5"
                        x="7"
                        y="43"
                        width="7"
                        height="6"
                        fill="#06AFF2"
                      />
                      <rect
                        opacity="0.5"
                        x="7"
                        y="18"
                        width="7"
                        height="6"
                        fill="#06AFF2"
                      />
                      <rect
                        opacity="0.28"
                        x="23"
                        y="1"
                        width="1"
                        height="59"
                        fill="#E9E9ED"
                      />
                      <rect
                        className="selected"
                        x="20"
                        y="33"
                        width="7"
                        height="6"
                        fill="#06AFF2"
                      />
                      <rect x="20" y="8" width="7" height="6" fill="#06AFF2" />
                      <rect
                        opacity="0.28"
                        x="36"
                        y="1"
                        width="1"
                        height="58"
                        fill="#E9E9ED"
                      />
                      <rect
                        opacity="0.3"
                        x="33"
                        y="46"
                        width="7"
                        height="6"
                        fill="#06AFF2"
                      />
                      <rect
                        opacity="0.3"
                        x="33"
                        y="20"
                        width="7"
                        height="6"
                        fill="#06AFF2"
                      />
                      <rect
                        opacity="0.28"
                        x="49"
                        y="8"
                        width="1"
                        height="44"
                        fill="#E9E9ED"
                      />
                      <rect x="46" y="36" width="7" height="6" fill="#06AFF2" />
                      <rect x="46" y="11" width="7" height="6" fill="#06AFF2" />
                    </svg>
                    <text
                      fontFamily="Roboto"
                      textAnchor="middle"
                      fill="#82838E"
                      fontSize="12"
                      x={childNodeCenterX}
                      y={childNodeCenterY + 50}
                    >{`${connectedLength} Node(s)`}</text>
                  </>
                )}
              </g>
            );
          }
          return null;
        })}
        <g
          id="center"
          className={classes.rootNode}
          tabIndex={0}
          onClick={e => {
            setNode(centerNode);
            setSelected(e.target);
          }}
        >
          <circle
            cx={`${START_DRAW_X}`}
            cy={`${START_DRAW_Y}`}
            r={R1}
            fill="white"
            stroke="#06AFF2"
          />
          <text
            fontFamily="Roboto"
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#06AFF2"
            fontWeight="700"
            fontSize="24"
            x={`${START_DRAW_X}`}
            y={`${START_DRAW_Y}`}
          >
            Milvus
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Topo;
