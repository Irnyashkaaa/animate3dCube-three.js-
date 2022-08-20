
window.onload = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    const canvas = document.getElementById('canvas')

    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)

    const scene = new THREE.Scene()


    const renderer = new THREE.WebGLRenderer({ canvas: canvas })
    renderer.setClearColor(0x000000)


    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000)
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
        const cubeGeometry = new THREE.RoundedBoxGeometry(100, 100, 100, 10, 10)
        const cubeMaterial = new THREE.MeshPhysicalMaterial({ transmission: 0.9 })
        const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cubeMesh.position.set(x, y, z)
        bigCubeGroup.add(cubeMesh)
        let smallY = y
        let smallX = x
        let smallZ = z
        if (y === 450) {
            smallY = 400
        } else if (y === 150) {
            smallY = 200
        } 
        if (x === 50) {
            smallX = 100
        } else if (x === 350) {
            smallX = 300
        }
        if (z === 0) {
            smallZ = 50
        }else if (z === 300) {
            smallZ = 250
        }

        bigCubeGroupArray.push({
            bigPozition: {x: x, y: y, z: z},
            smallPozition: {x: smallX, y: smallY, z: smallZ}
        })
    }

    for (let y = 150; y <= 450; y += 150) {
        for (let k = 50; k <= 350; k += 150) {
            createCube(k, y, 0)
            if (k === 200 && y === 300) {
                const sphereGeometry = new THREE.SphereBufferGeometry(80, 20, 20)
                const sphereMaterial = new THREE.MeshPhysicalMaterial({ transmission: 0.4, emissive: 0xffffff})
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
                sphere.position.set(k, y, 150)
                bigCubeGroupArray.push({
                    bigPozition: {x: k, y: y, z: 150},
                    smallPozition: {x: k, y: 300, z: 150}
                })
                bigCubeGroup.add(sphere)
            } else {
                createCube(k, y, 150)
            }
            createCube(k, y, 300)

        }
    }

    

    const setBigPositionToAllCube = () => {
        bigCubeGroupArray.map((cubeElement, i) => {
            const position = bigCubeGroupArray[i].smallPozition
            if (bigCubeGroup.children[i].position.x > position.x) {
                bigCubeGroup.children[i].position.x -= 0.4
            } else if (bigCubeGroup.children[i].position.x < position.x) {
                bigCubeGroup.children[i].position.x += 0.4
            }
            if (bigCubeGroup.children[i].position.y > position.y) {
                bigCubeGroup.children[i].position.y -= 0.4
            } else if (bigCubeGroup.children[i].position.y < position.y) {
                bigCubeGroup.children[i].position.y += 0.4
            }

            if (bigCubeGroup.children[i].position.z > position.z) {
                bigCubeGroup.children[i].position.z -= 0.4
            } else if (bigCubeGroup.children[i].position.z < position.z) {
                bigCubeGroup.children[i].position.z += 0.4
            }
            
        })
    }

    scene.add(bigCubeGroup)

    const animate = () => {

        setBigPositionToAllCube()
        // bigCubeGroup.rotation.y += 0.004
        bigCubeGroup.rotation.x = 0.4
        // bigCubeGroup.rotation.y = -0.4
        bigCubeGroup.position.z = -350
        bigCubeGroup.position.y = 70
        bigCubeGroup.position.x = 70
        renderer.render(scene, camera)

        requestAnimationFrame(function () { animate() })
    }
    animate()
}