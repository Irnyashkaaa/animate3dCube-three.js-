
window.onload = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    const canvas = document.getElementById('canvas')

    canvas.setAttribute('width', width/2 + 100)
    canvas.setAttribute('height', height)

    const scene = new THREE.Scene()


    const renderer = new THREE.WebGLRenderer({ canvas: canvas })
    renderer.setClearColor(0x000000)


    const camera = new THREE.PerspectiveCamera(45, (width/2 + 100) / (height), 0.1, 5000)
    camera.position.set(-160, 270, 1000)

    const createLight = (x, y, z) => {
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(x, y, z);
        scene.add(light)
    }

    createLight(-100, 20, 20)
    createLight(100, 40, 70)


    const bigCubeGroupArray = []

    const bigCubeGroup = new THREE.Group()
    const createCube = (x, y, z) => {
        const cubeGeometry = new THREE.RoundedBoxGeometry(110, 110, 110, 10, 5)
        const cubeMaterial = new THREE.MeshPhysicalMaterial({ transparent: true, opacity: 0.8, color: 0x666666})
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cubeMesh.position.set(x, y, z)
        bigCubeGroup.add(cubeMesh)
        let smallY = y
        let smallX = x
        let smallZ = z
        y === 540 ? smallY = 480
            : y === 180 ? smallY = 240
                : smallY;
        x === 60 ? smallX = 120
            : x === 420 ? smallX = 360
                : smallX
        z === 0 ? smallZ = 60
            : z === 360 ? smallZ = 300
                : smallZ


        bigCubeGroupArray.push({
            bigPosition: { x: x, y: y, z: z },
            smallPosition: { x: smallX, y: smallY, z: smallZ }
        })
    }

    for (let y = 180; y <= 540; y += 180) {
        for (let k = 60; k <= 420; k += 180) {
            createCube(k, y, 0)
            if (k === 240 && y === 360) {
                const sphereGeometry = new THREE.SphereBufferGeometry(100, 20, 20)
                const sphereMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd, emissive: 0x9900FF } ) 
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
                sphere.position.set(k, y, 180)
                bigCubeGroupArray.push({
                    bigPosition: { x: k, y: y, z: 180 },
                    smallPosition: { x: k, y: y, z: 180 }
                })
                bigCubeGroup.add(sphere)
            } else {
                createCube(k, y, 180)
            }
            createCube(k, y, 360)

        }
    }


    bigCubeGroup.rotation.x = 0.4
    bigCubeGroup.position.z = -350
    bigCubeGroup.position.y = 70
    bigCubeGroup.position.x = -310
    scene.add(bigCubeGroup)

    let cubeDo = 'small'
    let randomCubes = [0]

    const createRandomCubesArray = () => {
        while (randomCubes.length < 10) {
            const randomNumber = Math.ceil(Math.random() * 26)
            if (!randomCubes.includes(randomNumber)) {
                randomCubes.push(randomNumber)
            }            
        }
    }

    createRandomCubesArray()


    const setAllCubePosition = () => {
        if (cubeDo === 'small') {
            for (let i = 0; i < bigCubeGroupArray.length; i++) {
                changeCubePosition(i, cubeDo)
            }
            if (Math.ceil(bigCubeGroup.children[0].position.x) === bigCubeGroupArray[0].smallPosition.x) {
                cubeDo = ''
                setTimeout(() => cubeDo = 'random', 1000)
            }
        } else if ( cubeDo === 'big') {
            createRandomCubesArray()

            for (let i = 0; i < bigCubeGroupArray.length; i++) {
                changeCubePosition(i, cubeDo)
            }

            if (Math.ceil(bigCubeGroup.children[0].position.x) === bigCubeGroupArray[0].bigPosition.x) {
                cubeDo = ''
                setTimeout(() => cubeDo = 'small', 1000)
            }
        } else if (cubeDo === 'random') {
            bigCubeGroup.children.map((currentCube, i) => {
                randomCubes.includes(i) ? changeCubePosition(i, 'big') : ''
            })
            if (Math.ceil(bigCubeGroup.children[randomCubes[0]].position.x) === bigCubeGroupArray[randomCubes[0]].bigPosition.x) {
                cubeDo = ''
                setTimeout (() => cubeDo = 'randomReverse', 1000)
            }
        } else if (cubeDo === 'randomReverse') {

            bigCubeGroup.children.map((currentCube, i) => {
                randomCubes.includes(i) ? changeCubePosition(i, 'small') : changeCubePosition(i, 'big')
            })

            if (Math.ceil(bigCubeGroup.children[randomCubes[0]].position.x) === bigCubeGroupArray[randomCubes[0]].smallPosition.x) {
                cubeDo = ''
                setTimeout(() => {cubeDo = 'big'}, 1000)
            }
        }

       
    }

    const changeCubePosition = (cubeNumber, cubeDo) => {
        const cubeCurrentPosition = bigCubeGroup.children[cubeNumber].position
        const cubeBigPosition = bigCubeGroupArray[cubeNumber].bigPosition
        const cubeSmallPosition = bigCubeGroupArray[cubeNumber].smallPosition
        let position;
        switch (cubeDo) {
            case 'big':
                position = cubeBigPosition
                break
            case 'small':
                position = cubeSmallPosition
                break
        }

        if (cubeCurrentPosition.x <= position.x) {
            cubeCurrentPosition.x += 1.8
        } else if (cubeCurrentPosition.x > position.x) {
            cubeCurrentPosition.x -= 1.8
        }
        if (cubeCurrentPosition.y <= position.y) {
            cubeCurrentPosition.y += 1.8
        } else if (cubeCurrentPosition.y > position.y) {
            cubeCurrentPosition.y -= 1.8
        }
        if (cubeCurrentPosition.z <= position.z) {
            cubeCurrentPosition.z += 1.8
        } else if (cubeCurrentPosition.z > position.z) {
            cubeCurrentPosition.z -= 1.8
        }

    }

    const animate = () => {

        bigCubeGroup.rotation.y += 0.0003
        
        
        setAllCubePosition()
        renderer.render(scene, camera)
        requestAnimationFrame(function () { animate() })

    }
    animate()
}